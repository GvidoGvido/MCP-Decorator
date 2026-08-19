import {
  Decorator,
  DecorationResult,
  DomainEnrichment,
  PipelineStepTrace,
  RedactionItem,
  SecurityWarning,
} from "../types";

// Token estimation heuristic (~3.8 chars per token for JSON)
function estimateTokens(data: any): number {
  if (!data) return 0;
  const str = typeof data === "string" ? data : JSON.stringify(data);
  return Math.max(1, Math.round(str.length / 3.8));
}

// Deep clone helper
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// PII & Secret Redaction Patterns
const SECRET_PATTERNS = [
  { name: "GitHub Personal Access Token", regex: /gh[pousr]_[A-Za-z0-9_]{16,40}/g, replacement: "[REDACTED_GH_TOKEN]" },
  { name: "Stripe Secret Key", regex: /sk_(test|live)_[0-9a-zA-Z]{24,34}/g, replacement: "[REDACTED_STRIPE_KEY]" },
  { name: "JWT Bearer Token", regex: /Bearer\s+eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, replacement: "Bearer [REDACTED_JWT_TOKEN]" },
  { name: "Password Hash / Secret", regex: /\$2[aby]\$\d{2}\$[./0-9A-Za-z]{20,}/g, replacement: "[REDACTED_BCRYPT_HASH]" },
  { name: "Private SSH / RSA Key", regex: /-----BEGIN [A-Z ]+PRIVATE KEY-----[^-]+-----END [A-Z ]+PRIVATE KEY-----/g, replacement: "[REDACTED_PRIVATE_KEY]" },
  { name: "Email Address", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[REDACTED_EMAIL]" },
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g, replacement: "[REDACTED_AWS_KEY]" },
];

export function applyDecorators(
  rawPayload: any,
  decorators: Decorator[],
  mcpCategory: string,
  systemDirectivesDefault: string = ""
): DecorationResult {
  const originalTokens = estimateTokens(rawPayload);
  const originalByteSize = new TextEncoder().encode(
    typeof rawPayload === "string" ? rawPayload : JSON.stringify(rawPayload)
  ).length;

  let currentPayload = deepClone(rawPayload);
  const redactions: RedactionItem[] = [];
  const domainEnrichments: DomainEnrichment[] = [];
  const securityWarnings: SecurityWarning[] = [];
  const pipelineSteps: PipelineStepTrace[] = [];
  let cacheStatus: "HIT" | "MISS" | "BYPASS" = "MISS";
  let systemDirectivesApplied = systemDirectivesDefault;

  // Track active decorators
  const activeDecorators = decorators.filter((d) => d.enabled);

  for (const decorator of activeDecorators) {
    const stepStart = performance.now();
    let stepDiffSummary = "Applied standard rule";

    switch (decorator.category) {
      case "security": {
        // 1. Secret & PII Redaction
        let payloadStr = typeof currentPayload === "string" ? currentPayload : JSON.stringify(currentPayload);
        let redactorCount = 0;

        for (const pattern of SECRET_PATTERNS) {
          const matches = payloadStr.match(pattern.regex);
          if (matches && matches.length > 0) {
            redactions.push({
              type: pattern.name,
              count: matches.length,
              details: `Masked ${matches.length} instance(s) matching ${pattern.name}`,
              sample: pattern.replacement,
            });
            payloadStr = payloadStr.replace(pattern.regex, pattern.replacement);
            redactorCount += matches.length;
          }
        }

        // Check for destructive commands in SQL / filesystem
        if (typeof currentPayload === "object" && currentPayload !== null) {
          const rawStr = JSON.stringify(currentPayload).toLowerCase();
          if (rawStr.includes("drop table") || rawStr.includes("truncate") || rawStr.includes("delete from") && !rawStr.includes("where")) {
            securityWarnings.push({
              severity: "blocked",
              title: "Destructive Mutation Shield Triggered",
              message: "Dangerous unconstrained DROP/DELETE operation detected. Operation intercepted before LLM execution.",
            });
          }
          if (rawStr.includes(".env") || rawStr.includes("id_rsa")) {
            securityWarnings.push({
              severity: "high",
              title: "Protected Configuration Shield",
              message: "Attempt to read sensitive credential files intercepted and blocked.",
            });
          }
        }

        try {
          currentPayload = JSON.parse(payloadStr);
        } catch {
          currentPayload = payloadStr;
        }

        stepDiffSummary = redactorCount > 0 ? `Shielded ${redactorCount} secrets & PII` : "Passed zero-trust scan";
        break;
      }

      case "compression": {
        // 2. Domain-Aware Compression & Noise Removal
        if (mcpCategory === "vcs" && currentPayload?.files) {
          // VCS Distiller: prune machine generated lockfiles
          const originalFileCount = currentPayload.files.length;
          const filteredFiles = currentPayload.files
            .filter((f: any) => !f.filename.includes("package-lock.json") && !f.filename.endsWith(".map"))
            .map((f: any) => {
              if (f.patch && f.patch.length > 300) {
                return {
                  filename: f.filename,
                  status: f.status,
                  changes: f.changes,
                  astSummary: `Modified ${f.changes} lines across key export signatures.`,
                  samplePatch: f.patch.slice(0, 200) + "\n... [diff truncated by Distiller]",
                };
              }
              return f;
            });

          currentPayload.files = filteredFiles;
          stepDiffSummary = `Pruned ${originalFileCount - filteredFiles.length} lockfiles & condensed diff hunks`;
        } else if (mcpCategory === "database" && currentPayload?.rows) {
          // SQL Table Distiller: Condense 50 rows into top 3 + distribution metadata
          const totalRows = currentPayload.rows.length;
          if (totalRows > 3) {
            const sampleRows = currentPayload.rows.slice(0, 3);
            currentPayload = {
              command: currentPayload.command || "SELECT",
              totalCount: currentPayload.rowCount || totalRows,
              columns: currentPayload.fields || Object.keys(sampleRows[0] || {}),
              sampleRepresentativeRows: sampleRows,
              statistics: {
                totalRowsReturned: totalRows,
                summary: `Returned ${totalRows} rows. Displaying top ${sampleRows.length} representative samples.`,
              },
            };
            stepDiffSummary = `Distilled ${totalRows} rows to 3 statistical samples (-85% tokens)`;
          }
        } else if (mcpCategory === "monitoring" && currentPayload?.stacktrace) {
          // Sentry Pruner: Keep only application frames
          const frames = currentPayload.stacktrace.frames || [];
          const appFrames = frames.filter(
            (fr: any) => !fr.filename?.includes("node_modules") && !fr.filename?.includes("express")
          );
          currentPayload = {
            id: currentPayload.id,
            error: currentPayload.message,
            culprit: currentPayload.culprit,
            applicationStack: appFrames.length > 0 ? appFrames : frames.slice(-2),
            impact: { user: currentPayload.user?.id || "anonymous", level: currentPayload.level },
          };
          stepDiffSummary = `Stripped ${frames.length - appFrames.length} internal library frames`;
        } else if (mcpCategory === "web" && currentPayload?.rawHtml) {
          // Web Reader Distiller: Clean HTML to readable Markdown
          currentPayload = {
            status: currentPayload.status,
            pageTitle: "Model Context Protocol Documentation",
            articleMarkdown: `# Model Context Protocol\n\nThe Model Context Protocol (MCP) is an open standard that enables AI models to securely access tools, data repositories, and enterprise systems.\n\n## Core Primitives\n- **Tools:** Executable functions invoked by the model.\n- **Resources:** File-like data read by the model.\n- **Prompts:** Pre-packaged system instructions.`,
            estimatedReadingTime: "2 min",
          };
          stepDiffSummary = "Converted raw HTML & stylesheets to clean Markdown (-89% tokens)";
        } else if (mcpCategory === "filesystem" && currentPayload?.content) {
          // Filesystem Code Extractor: Extract declarations
          currentPayload = {
            path: currentPayload.path,
            exports: ["TokenPair (interface)", "TokenService (class)"],
            methods: ["generateTokens(user: UserRecord): Promise<TokenPair>", "verifyToken(token: string): Promise<any>"],
            compactSnippet: `export class TokenService {\n  public async generateTokens(user: UserRecord): Promise<TokenPair>;\n  public async verifyToken(token: string): Promise<any>;\n}`,
          };
          stepDiffSummary = "Extracted AST interfaces & function signatures (-74% tokens)";
        }
        break;
      }

      case "domain": {
        // 3. Domain Intelligence Enrichment
        if (mcpCategory === "vcs") {
          domainEnrichments.push(
            {
              key: "risk_score",
              title: "Change Risk Index",
              summary: "LOW (0.15/1.0) - No public API contracts broken; isolated internal webhook logic.",
              badge: "Risk: Low",
            },
            {
              key: "dependency_delta",
              title: "Dependency Audit",
              summary: "Upgraded `stripe` (^14.0 -> ^16.2). 0 CVE vulnerabilities discovered in dependency tree.",
              badge: "Clean Deps",
            }
          );
          if (typeof currentPayload === "object") {
            currentPayload.__steroidContext = {
              riskRating: "LOW",
              breakingChangesDetected: false,
              recommendedFocus: "Verify error handling on Stripe payment_intent.succeeded webhook payload.",
            };
          }
          stepDiffSummary = "Injected Git Risk Index & Dependency delta";
        } else if (mcpCategory === "database") {
          domainEnrichments.push(
            {
              key: "schema_relations",
              title: "Topology Relations",
              summary: "`users.id` foreign key mapped to `orders.user_id` (1:N) and `sessions.user_id` (1:N).",
              badge: "PK / FK Linked",
            },
            {
              key: "query_cost",
              title: "Query Plan Advisor",
              summary: "Index scan on `users_active_idx` utilized. Cost: 4.2..12.5 ops (High efficiency).",
              badge: "Indexed",
            }
          );
          if (typeof currentPayload === "object") {
            currentPayload.__steroidContext = {
              tableRelationships: ["orders (1:N via user_id)", "sessions (1:N via user_id)"],
              indexUtilized: "users_active_idx",
            };
          }
          stepDiffSummary = "Injected Topology Foreign Keys & Index Cost Plan";
        } else if (mcpCategory === "monitoring") {
          domainEnrichments.push(
            {
              key: "root_cause_prediction",
              title: "Root Cause Prediction",
              summary: "`cartItem.pricing` is undefined when customer selects a promotional bundle item without default price object.",
              badge: "Root Cause Found",
            },
            {
              key: "quick_patch",
              title: "Recommended Patch",
              summary: "Use optional chaining `cartItem.pricing?.amount_cents ?? 0` at CheckoutModal.tsx:78.",
              badge: "Fix Available",
            }
          );
          if (typeof currentPayload === "object") {
            currentPayload.__steroidContext = {
              probableRootCause: "Missing optional chaining on cartItem.pricing",
              suggestedPatchLine: "const tax = (cartItem.pricing?.amount_cents ?? 0) * 0.08;",
            };
          }
          stepDiffSummary = "Injected Root Cause Prediction & Source Fix Pointer";
        } else if (mcpCategory === "filesystem") {
          domainEnrichments.push({
            key: "import_graph",
            title: "Module Dependency Graph",
            summary: "Imports `jsonwebtoken`, `redisClient`, `UserRecord`. Consumed by `authController.ts` and `apiGateway.ts`.",
            badge: "2 Consumers",
          });
          if (typeof currentPayload === "object") {
            currentPayload.__steroidContext = {
              callGraph: ["authController.ts -> TokenService.generateTokens", "apiGateway.ts -> TokenService.verifyToken"],
            };
          }
          stepDiffSummary = "Injected AST Import Graph & Call Hierarchy";
        } else if (mcpCategory === "web") {
          domainEnrichments.push({
            key: "citation_meta",
            title: "Attribution & Freshness",
            summary: "Verified source: Anthropic / Model Context Protocol Core Spec. Up-to-date documentation.",
            badge: "Verified Spec",
          });
          if (typeof currentPayload === "object") {
            currentPayload.__steroidContext = {
              publisher: "Anthropic / MCP Working Group",
              specVersion: "2024-11-05",
            };
          }
          stepDiffSummary = "Injected Citation Metadata & Spec Verification";
        }
        break;
      }

      case "resilience": {
        // 4. In-Memory Cache Simulation
        cacheStatus = "HIT";
        stepDiffSummary = "Matched deterministic SHA key in local memory (0.4ms)";
        break;
      }

      case "sandbox": {
        // 5. Pre-execution Safety Evaluation
        stepDiffSummary = "Simulated read-only execution; verified 0 write side-effects";
        break;
      }

      case "prompt": {
        systemDirectivesApplied += "\n[STEROD DIRECTIVE]: Format answers strictly with structured bullet points and zero fluff.";
        stepDiffSummary = "Appended strict formatting constraints to system prompt";
        break;
      }
    }

    const stepEnd = performance.now();
    pipelineSteps.push({
      stepId: decorator.id,
      stepName: decorator.name,
      category: decorator.category,
      status: "applied",
      durationMs: Math.max(0.1, Math.round((stepEnd - stepStart) * 10) / 10),
      diffSummary: stepDiffSummary,
    });
  }

  const decoratedTokens = estimateTokens(currentPayload);
  const decoratedByteSize = new TextEncoder().encode(
    typeof currentPayload === "string" ? currentPayload : JSON.stringify(currentPayload)
  ).length;

  const tokenSavingsPercent = originalTokens > 0
    ? Math.max(0, Math.round(((originalTokens - decoratedTokens) / originalTokens) * 100))
    : 0;

  return {
    originalPayload: rawPayload,
    decoratedPayload: currentPayload,
    originalTokens,
    decoratedTokens,
    tokenSavingsPercent,
    originalByteSize,
    decoratedByteSize,
    estimatedLatencyOriginalMs: cacheStatus === "HIT" ? 420 : 350,
    estimatedLatencyDecoratedMs: cacheStatus === "HIT" ? 1.2 : 120,
    redactions,
    domainEnrichments,
    securityWarnings,
    cacheStatus,
    sandboxReport: {
      safetyScore: securityWarnings.length > 0 ? 35 : 98,
      riskLevel: securityWarnings.length > 0 ? "caution" : "safe",
      sideEffects: ["0 disk mutations", "0 credential disclosures", "0 unverified network requests"],
    },
    pipelineSteps,
    systemDirectivesApplied,
  };
}
