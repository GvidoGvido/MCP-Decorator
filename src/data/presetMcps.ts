import { McpSource } from "../types";

export const PRESET_MCPS: McpSource[] = [
  {
    id: "github",
    name: "GitHub / VCS MCP",
    tagline: "Commits, Pull Requests, Code Review & Blame",
    icon: "GitBranch",
    category: "vcs",
    systemDirectivesDefault:
      "CRITICAL: Present code diffs using standard unified diff blocks. Always prioritize breaking changes and newly introduced dependencies.",
    availableDecorators: [
      {
        id: "sec-token-scrub",
        name: "Zero-Trust Secret & Token Scrubber",
        category: "security",
        description: "Scans diffs and commit messages for leaked GitHub PATs (`ghp_`), AWS keys, private SSH keys, and auth headers, replacing them with masked placeholders.",
        enabled: true,
        isSteroid: true,
        badge: "Steroid Shield",
        config: { maskTokens: true, maskSshKeys: true },
      },
      {
        id: "comp-diff-pruner",
        name: "Smart Diff & Lockfile Distiller",
        category: "compression",
        description: "Filters out high-noise machine files (`package-lock.json`, minified bundles, `.map` files) and distills 500+ line diffs into AST modified signatures, cutting tokens by up to 80%.",
        enabled: true,
        isSteroid: true,
        badge: "-78% Tokens",
        config: { ignoreLockfiles: true, maxHunkLines: 40 },
      },
      {
        id: "dom-git-enricher",
        name: "Git Intelligence & Risk Analyzer",
        category: "domain",
        description: "Enriches the commit payload with automated breaking change detection, affected module impact score, test coverage delta, and authorship tags.",
        enabled: true,
        isSteroid: true,
        badge: "Smart Context",
        config: { detectBreakingChanges: true, computeModuleRisk: true },
      },
      {
        id: "res-semantic-cache",
        name: "Deterministic Git Cache",
        category: "resilience",
        description: "Caches immutable commit SHA lookups in-memory, dropping response latency from 420ms to 0.5ms on repeat tool calls.",
        enabled: true,
        isSteroid: false,
        badge: "Sub-ms Latency",
        config: { ttlSeconds: 3600 },
      },
      {
        id: "prompt-unified-directive",
        name: "System Directive Injector",
        category: "prompt",
        description: "Appends strict formatting directives to guide the LLM to output concise, actionable PR review comments.",
        enabled: true,
        isSteroid: false,
        config: {},
      },
    ],
    tools: [
      {
        id: "get_commit_diff",
        name: "github.get_commit_diff",
        description: "Fetch commit diff, changed files, and metadata for a specific commit SHA.",
        category: "vcs",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string" },
            repo: { type: "string" },
            sha: { type: "string" },
          },
          required: ["owner", "repo", "sha"],
        },
        sampleArgs: {
          owner: "acme-corp",
          repo: "core-payments-service",
          sha: "7f8b9e12048adbc91",
        },
        suggestedPrompt: "Review this commit for security vulnerabilities and breaking API changes.",
        sampleRawResponse: {
          sha: "7f8b9e12048adbc91458e0a3219481923058a91f",
          node_id: "MDY6Q29tbWl0MTI5NjI2OTo3ZjhiOWUxMjA0OGFkYmM5MTQ1OGUwYTMyMTk0ODE5MjMwNThhOTFm",
          commit: {
            author: {
              name: "Alex Dev",
              email: "alex.dev@acme-corp.internal",
              date: "2026-08-19T10:14:22Z",
            },
            committer: {
              name: "Alex Dev",
              email: "alex.dev@acme-corp.internal",
              date: "2026-08-19T10:14:22Z",
            },
            message:
              "feat: add stripe webhook handler and fallback auth header ghp_9948AkjhK83nLk20948JkLmN90qL for staging tests",
            tree: {
              sha: "6dcb09b5b57875f334f61aebed695e2e4193db5e",
              url: "https://api.github.com/repos/acme-corp/core-payments-service/git/trees/6dcb09b5b57875f334f61aebed695e2e4193db5e",
            },
            verification: {
              verified: false,
              reason: "unsigned",
            },
          },
          stats: {
            total: 842,
            additions: 790,
            deletions: 52,
          },
          files: [
            {
              filename: "src/services/stripeWebhook.ts",
              status: "modified",
              additions: 45,
              deletions: 2,
              changes: 47,
              patch:
                "@@ -12,6 +12,18 @@ export async function handleWebhook(event: StripeEvent) {\n+  // Internal fallback token\n+  const stagingSecret = 'sk_test_51Mz89Abc99023412398412498';\n+  if (event.type === 'payment_intent.succeeded') {\n+    await processPayment(event.data.object);\n+  }\n }",
            },
            {
              filename: "package-lock.json",
              status: "modified",
              additions: 740,
              deletions: 50,
              changes: 790,
              patch:
                "@@ -102,9 +102,15 @@\n-    \"stripe\": \"^14.0.0\",\n+    \"stripe\": \"^16.2.0\",\n+    \"@types/stripe\": \"^8.0.417\",\n+    \"lodash-es\": \"^4.17.21\",\n+    \"fast-deep-equal\": \"^3.1.3\",\n+    \"safe-buffer\": \"^5.2.1\",\n+    // [730 lines of generated sha512 integrity hashes...]",
            },
          ],
        },
      },
      {
        id: "search_pull_requests",
        name: "github.search_pull_requests",
        description: "List recent pull requests matching query filters.",
        category: "vcs",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
          },
          required: ["query"],
        },
        sampleArgs: { query: "is:pr is:open repo:acme-corp/core-payments-service" },
        suggestedPrompt: "Summarize pending pull requests and identify high risk PRs.",
        sampleRawResponse: {
          total_count: 2,
          items: [
            {
              id: 991204,
              number: 42,
              title: "refactor: migrate database schema to v3",
              user: { login: "sarah-db", id: 8812, type: "User" },
              body: "Migrates user table and adds column `stripe_customer_id` NOT NULL without default. Author email: sarah@acme.com",
              state: "open",
              draft: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: "postgres",
    name: "PostgreSQL / Database MCP",
    tagline: "Execute Queries, Schema Inspection, Guardrails",
    icon: "Database",
    category: "database",
    systemDirectivesDefault:
      "You are inspecting a read-only database query result. Highlight performance bottlenecks, missing indexes, and schema anomalies.",
    availableDecorators: [
      {
        id: "sec-sql-guard",
        name: "Destructive Mutation Shield & PII Masker",
        category: "security",
        description: "Intercepts dangerous queries (`DROP`, `TRUNCATE`, `DELETE` without `WHERE`) and redacts PII like customer emails, phone numbers, and password hashes from query result sets.",
        enabled: true,
        isSteroid: true,
        badge: "Destructive Shield",
        config: { blockUnsafeWrites: true, maskPiiColumns: true },
      },
      {
        id: "comp-table-distiller",
        name: "Statistical Table & Row Distiller",
        category: "compression",
        description: "Condenses raw multi-hundred row SQL result sets into top 5 representative rows + statistical distributions (min, max, count, nulls), avoiding context window bloat.",
        enabled: true,
        isSteroid: true,
        badge: "-85% Tokens",
        config: { sampleRows: 5, computeStats: true },
      },
      {
        id: "dom-schema-enricher",
        name: "Schema Topology & Index Enricher",
        category: "domain",
        description: "Appends foreign key relations, primary index statuses, and estimated query execution costs to prevent the LLM from making incorrect join assumptions.",
        enabled: true,
        isSteroid: true,
        badge: "Topology Context",
        config: { injectForeignKeys: true, estimateIndexCost: true },
      },
      {
        id: "sand-query-simulator",
        name: "Dry-Run Query Sandbox",
        category: "sandbox",
        description: "Analyzes statement complexity, estimated disk read impact, and produces an execution risk rating before LLM ingestion.",
        enabled: true,
        isSteroid: true,
        badge: "Safety Sandbox",
        config: { maxCostThreshold: 5000 },
      },
    ],
    tools: [
      {
        id: "query_database",
        name: "postgres.query_database",
        description: "Execute a SQL query against PostgreSQL database and return rows.",
        category: "database",
        inputSchema: {
          type: "object",
          properties: {
            sql: { type: "string" },
            params: { type: "array" },
          },
          required: ["sql"],
        },
        sampleArgs: {
          sql: "SELECT id, full_name, email, password_hash, stripe_id, balance_cents, created_at FROM users WHERE active = true LIMIT 50;",
        },
        suggestedPrompt: "Analyze the user accounts and identify any suspicious high-balance entries.",
        sampleRawResponse: {
          rowCount: 50,
          command: "SELECT",
          fields: ["id", "full_name", "email", "password_hash", "stripe_id", "balance_cents", "created_at"],
          rows: [
            {
              id: "usr_01J8F9",
              full_name: "Elena Rostova",
              email: "elena.rostova@example.com",
              password_hash: "$2b$12$e98AbC...secretHashSample123984128947",
              stripe_id: "cus_Nb9823190841",
              balance_cents: 1450000,
              created_at: "2025-01-15T08:30:00Z",
            },
            {
              id: "usr_01J8FA",
              full_name: "Marcus Vance",
              email: "m.vance@financialcorp.org",
              password_hash: "$2b$12$k829JkL...secretHashSample9981240182",
              stripe_id: "cus_Nb9823190842",
              balance_cents: 3500,
              created_at: "2025-02-10T11:20:00Z",
            },
            {
              id: "usr_01J8FB",
              full_name: "Sophia Chen",
              email: "sophia.chen@techstart.io",
              password_hash: "$2b$12$p091MnB...secretHashSample4418290192",
              stripe_id: "cus_Nb9823190843",
              balance_cents: 89000,
              created_at: "2025-03-01T14:15:00Z",
            },
            {
              id: "usr_01J8FC",
              full_name: "Liam O'Connor",
              email: "liam.oc@dublinholdings.ie",
              password_hash: "$2b$12$q771LkK...secretHashSample5519280193",
              stripe_id: "cus_Nb9823190844",
              balance_cents: 225000,
              created_at: "2025-04-18T16:45:00Z",
            },
            {
              id: "usr_01J8FD",
              full_name: "Amina Al-Mansoor",
              email: "amina@gulfinvest.ae",
              password_hash: "$2b$12$x112ZzA...secretHashSample6619280194",
              stripe_id: "cus_Nb9823190845",
              balance_cents: 9800000,
              created_at: "2025-05-22T09:10:00Z",
            },
          ],
        },
      },
      {
        id: "describe_table_schema",
        name: "postgres.describe_table_schema",
        description: "Retrieve column definitions, types, and constraints for a table.",
        category: "database",
        inputSchema: {
          type: "object",
          properties: { tableName: { type: "string" } },
          required: ["tableName"],
        },
        sampleArgs: { tableName: "orders" },
        suggestedPrompt: "Recommend indexing strategies based on the table schema.",
        sampleRawResponse: {
          table: "orders",
          columns: [
            { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
            { name: "user_id", type: "text", nullable: false },
            { name: "total_amount", type: "numeric(10,2)", nullable: false },
            { name: "status", type: "varchar(32)", nullable: false },
            { name: "meta_payload", type: "jsonb", nullable: true },
          ],
        },
      },
    ],
  },
  {
    id: "filesystem",
    name: "Filesystem / Codebase MCP",
    tagline: "Local File Trees, AST Slicing & Security Filtering",
    icon: "FolderTree",
    category: "filesystem",
    systemDirectivesDefault:
      "Analyze the codebase structure. Focus on architecture separation, security surface, and interface boundaries.",
    availableDecorators: [
      {
        id: "sec-path-shield",
        name: "Path Traversal & Secret File Shield",
        category: "security",
        description: "Strictly guards against reading `.env`, `id_rsa`, `.aws/credentials`, or escaping workspace root directory via `../` path traversal.",
        enabled: true,
        isSteroid: true,
        badge: "Workspace Guard",
        config: { blockHiddenFiles: true, blockEnvFiles: true },
      },
      {
        id: "comp-ast-outline",
        name: "AST Outline & Signature Squeezer",
        category: "compression",
        description: "Compresses large source files (1,000+ lines) into clean exported TypeScript / Python interfaces, function signatures, and JSDoc summaries.",
        enabled: true,
        isSteroid: true,
        badge: "-72% Tokens",
        config: { keepSignaturesOnly: true },
      },
      {
        id: "dom-dependency-mapper",
        name: "Dependency & Call Graph Annotator",
        category: "domain",
        description: "Extracts imported external packages and internal module dependencies, providing an instant high-level architecture graph to the LLM.",
        enabled: true,
        isSteroid: true,
        badge: "Arch Graph",
        config: { extractImports: true },
      },
    ],
    tools: [
      {
        id: "read_code_file",
        name: "filesystem.read_file",
        description: "Read the full contents of a code or text file on disk.",
        category: "filesystem",
        inputSchema: {
          type: "object",
          properties: { path: { type: "string" } },
          required: ["path"],
        },
        sampleArgs: { path: "src/auth/tokenService.ts" },
        suggestedPrompt: "How does the tokenService handle token refresh and signing?",
        sampleRawResponse: {
          path: "src/auth/tokenService.ts",
          sizeBytes: 14280,
          content: `// Copyright 2026 Acme Corp. All rights reserved.
// Master Secret for fallback signing (DO NOT COMMIT):
const HARDCODED_INTERNAL_SECRET = "sk_live_9948271049182390141";

import jwt from "jsonwebtoken";
import { redisClient } from "../db/redis";
import { UserRecord } from "../types";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class TokenService {
  private issuer = "acme-auth-v2";
  
  public async generateTokens(user: UserRecord): Promise<TokenPair> {
    // 250 lines of boilerplate token hashing, redis session persistence,
    // encryption, crypto key rolling, and trace logs...
    const accessToken = jwt.sign({ uid: user.id, role: user.role }, HARDCODED_INTERNAL_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ uid: user.id, type: 'refresh' }, HARDCODED_INTERNAL_SECRET, { expiresIn: '7d' });
    await redisClient.set(\`sess:\${user.id}\`, refreshToken, 'EX', 7 * 86400);
    return { accessToken, refreshToken, expiresIn: 900 };
  }

  public async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, HARDCODED_INTERNAL_SECRET);
  }
}`,
        },
      },
    ],
  },
  {
    id: "sentry",
    name: "Sentry / APM Logs MCP",
    tagline: "Stack Traces, Breadcrumbs, Error Clustering",
    icon: "Activity",
    category: "monitoring",
    systemDirectivesDefault:
      "Diagnose the production issue from the stack trace. Identify root cause, impacted user count, and recommend the exact fix.",
    availableDecorators: [
      {
        id: "sec-auth-header-strip",
        name: "Bearer Token & Cookie Masker",
        category: "security",
        description: "Strips Authorization headers, session cookies, and user IP addresses from Sentry event contexts.",
        enabled: true,
        isSteroid: true,
        badge: "Privacy Masker",
        config: { maskCookies: true, maskAuthHeaders: true },
      },
      {
        id: "comp-breadcrumb-dedup",
        name: "Breadcrumb Deduplicator & Frame Pruner",
        category: "compression",
        description: "Collapses 100+ repetitive DOM / navigation breadcrumbs and third-party library frames (`node_modules/express`), focusing purely on application code.",
        enabled: true,
        isSteroid: true,
        badge: "-81% Tokens",
        config: { pruneLibraryFrames: true, collapseRepetitive: true },
      },
      {
        id: "dom-rootcause-annotator",
        name: "Root Cause & Source Pointer Enricher",
        category: "domain",
        description: "Highlights the exact failing frame, line number, exception type, and correlates recent deployment tags.",
        enabled: true,
        isSteroid: true,
        badge: "Root Cause Engine",
        config: { highlightFailingFrame: true },
      },
    ],
    tools: [
      {
        id: "get_error_event",
        name: "sentry.get_error_event",
        description: "Retrieve complete Sentry crash report and breadcrumbs for an issue.",
        category: "monitoring",
        inputSchema: {
          type: "object",
          properties: { eventId: { type: "string" } },
          required: ["eventId"],
        },
        sampleArgs: { eventId: "evt_99182a4c" },
        suggestedPrompt: "Explain why this payment error occurred and how to fix it.",
        sampleRawResponse: {
          id: "evt_99182a4c",
          project: "checkout-frontend",
          message: "TypeError: Cannot read properties of undefined (reading 'amount_cents')",
          culprit: "src/components/CheckoutModal.tsx in calculateTax",
          level: "error",
          user: {
            id: "usr_4491",
            email: "victim.user@customer.com",
            ip_address: "192.0.2.14",
          },
          request: {
            url: "https://shop.acme.com/api/checkout",
            headers: {
              authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfNDQ5MSIsImlhdCI6MTYyMDAwMH0.signature991283",
              cookie: "session_id=sess_9948291048201948; auth=1",
            },
          },
          stacktrace: {
            frames: [
              { filename: "node_modules/react-dom/cjs/react-dom.production.min.js", lineno: 4120 },
              { filename: "node_modules/react-dom/cjs/react-dom.production.min.js", lineno: 4190 },
              { filename: "node_modules/express/lib/router/layer.js", lineno: 95 },
              {
                filename: "src/components/CheckoutModal.tsx",
                lineno: 78,
                colno: 14,
                function: "calculateTax",
                context_line: "  const tax = cartItem.pricing.amount_cents * 0.08;",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: "web_fetch",
    name: "Web & API Fetch MCP",
    tagline: "URL Scraping, Reader Mode, Content Distillation",
    icon: "Globe",
    category: "web",
    systemDirectivesDefault:
      "Synthesize key insights from the distilled web article. Extract facts, technical specifications, and citations.",
    availableDecorators: [
      {
        id: "comp-reader-markdown",
        name: "Reader-Mode Markdown Distiller",
        category: "compression",
        description: "Converts raw messy HTML (scripts, SVGs, stylesheets, tracking pixels) into concise semantic Markdown, reducing tokens by up to 90%.",
        enabled: true,
        isSteroid: true,
        badge: "-89% Tokens",
        config: { stripNav: true, stripAds: true, toMarkdown: true },
      },
      {
        id: "sec-safe-url-filter",
        name: "Malicious Domain & SSRF Guard",
        category: "security",
        description: "Guards against internal network probing (`127.0.0.1`, `169.254.169.254` AWS metadata) and unverified redirect URLs.",
        enabled: true,
        isSteroid: true,
        badge: "SSRF Shield",
        config: { blockPrivateIps: true },
      },
      {
        id: "dom-opengraph-extractor",
        name: "Metadata & Citation Enricher",
        category: "domain",
        description: "Extracts canonical URL, publish date, author, and reading time header for reliable LLM attribution.",
        enabled: true,
        isSteroid: false,
        config: {},
      },
    ],
    tools: [
      {
        id: "fetch_page",
        name: "web.fetch_page",
        description: "Fetch the raw HTML content of an external web page.",
        category: "web",
        inputSchema: {
          type: "object",
          properties: { url: { type: "string" } },
          required: ["url"],
        },
        sampleArgs: { url: "https://modelcontextprotocol.io/introduction" },
        suggestedPrompt: "Summarize the architecture and security principles of MCP.",
        sampleRawResponse: {
          status: 200,
          contentType: "text/html",
          rawHtml: `<!DOCTYPE html><html lang="en"><head><script src="https://cdn.tracking.com/analytics.js"></script><style>.ad-banner{display:block;}</style><title>Model Context Protocol Documentation</title><meta property="og:title" content="Model Context Protocol (MCP) Overview" /><meta name="author" content="Anthropic Team" /></head><body><nav><a href="/">Home</a><a href="/pricing">Pricing</a><div class="tracker">...</div></nav><main><article><h1>Model Context Protocol</h1><p>The Model Context Protocol (MCP) is an open standard that enables AI models to securely access tools, data repositories, and enterprise systems.</p><h2>Core Primitives</h2><ul><li><strong>Tools:</strong> Executable functions invoked by the model.</li><li><strong>Resources:</strong> File-like data read by the model.</li><li><strong>Prompts:</strong> Pre-packaged system instructions.</li></ul></article></main><footer>© 2026 Acme Docs. Cookies Policy. Terms of Service.</footer></body></html>`,
        },
      },
    ],
  },
];
