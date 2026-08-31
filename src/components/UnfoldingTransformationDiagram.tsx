import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  GitBranch,
  Database,
  Server,
  Lock,
  ChevronRight,
  Split,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ScenarioData {
  id: string;
  name: string;
  icon: typeof GitBranch;
  rawSource: string;
  rawTokens: number;
  distilledTokens: number;
  rawLatencyMs: number;
  distilledLatencyMs: number;
  issuesIdentified: { label: string; risk: "critical" | "warning" | "info" }[];
  steroidsApplied: string[];
  rawJsonSnippet: string;
  distilledJsonSnippet: string;
  explanation: {
    problem: string;
    transformation: string;
    impact: string;
  };
}

const SCENARIOS: ScenarioData[] = [
  {
    id: "github-commit",
    name: "GitHub Diff & Auth Token Leak",
    icon: GitBranch,
    rawSource: "github.get_commit_diff (SHA: 7f8b9e...)",
    rawTokens: 3840,
    distilledTokens: 520,
    rawLatencyMs: 640,
    distilledLatencyMs: 14,
    issuesIdentified: [
      { label: "Leaked PAT: ghp_9948AkjhK83nLk20948...", risk: "critical" },
      { label: "Stripe Secret: sk_test_51Mz89Abc990...", risk: "critical" },
      { label: "740 lines of package-lock.json noise", risk: "warning" },
      { label: "Unverified unsigned commit tree", risk: "info" },
    ],
    steroidsApplied: [
      "Zero-Trust Secret & Token Scrubber",
      "Smart Diff & Lockfile Distiller",
      "Git Intelligence & Risk Analyzer",
      "Deterministic Git Cache",
    ],
    rawJsonSnippet: `{
  "sha": "7f8b9e12048adbc91458e0a3219481923058a91f",
  "commit": {
    "author": { "name": "Alex Dev", "email": "alex.dev@acme-corp.internal" },
    "message": "feat: fallback auth header ghp_9948AkjhK83nLk20948JkLmN90qL"
  },
  "stats": { "total": 842, "additions": 790, "deletions": 52 },
  "files": [
    {
      "filename": "src/services/stripeWebhook.ts",
      "patch": "@@ -12,6 +12,18 @@\\n+  const stagingSecret = 'sk_test_51Mz89Abc99023412398412498';"
    },
    {
      "filename": "package-lock.json",
      "patch": "// [730 lines of generated sha512 integrity hashes and noise...]"
    }
  ]
}`,
    distilledJsonSnippet: `{
  "sha": "7f8b9e12",
  "summary": "feat: add stripe webhook handler",
  "security_audit": {
    "secrets_neutralized": 2,
    "sanitized_tokens": ["[REDACTED_GH_TOKEN]", "[REDACTED_STRIPE_KEY]"],
    "zero_trust_status": "SECURE_PASS"
  },
  "ast_diff_distilled": {
    "primary_change": "src/services/stripeWebhook.ts (handleWebhook)",
    "noise_files_pruned": ["package-lock.json (730 lines suppressed)"],
    "token_reduction_ratio": "86.4%"
  },
  "injected_context": {
    "breaking_change_risk": "LOW (0.08)",
    "affected_services": ["payment-gateway-v2"]
  }
}`,
    explanation: {
      problem: "Raw tool response sends high-risk staging keys and hundreds of lines of useless package-lock JSON into LLM context, bloating tokens and risking key compromise.",
      transformation: "Zero-Trust Sentinel intercepts the payload, masks GitHub PATs and Stripe secrets, drops lockfiles, and attaches AST impact analysis.",
      impact: "Payload reduced from 3,840 → 520 tokens (-86.4%), secrets safely masked, downstream LLM reasoning latency reduced by 4x.",
    },
  },
  {
    id: "postgres-query",
    name: "PostgreSQL Query & PII Masking",
    icon: Database,
    rawSource: "postgres.query_database (SELECT * FROM users)",
    rawTokens: 4200,
    distilledTokens: 640,
    rawLatencyMs: 780,
    distilledLatencyMs: 22,
    issuesIdentified: [
      { label: "50 customer email addresses exposed", risk: "critical" },
      { label: "Bcrypt password hashes in result set", risk: "critical" },
      { label: "Unconstrained multi-column payload bloat", risk: "warning" },
    ],
    steroidsApplied: [
      "Destructive Mutation Shield & PII Masker",
      "Statistical Table & Row Distiller",
      "Schema Topology & Index Enricher",
      "Dry-Run Query Sandbox",
    ],
    rawJsonSnippet: `{
  "rowCount": 50,
  "command": "SELECT",
  "rows": [
    {
      "id": "usr_01J8F9",
      "full_name": "Elena Rostova",
      "email": "elena.rostova@example.com",
      "password_hash": "$2b$12$e98AbC...secretHashSample123984128947",
      "balance_cents": 1450000
    },
    {
      "id": "usr_01J8FA",
      "full_name": "Marcus Vance",
      "email": "m.vance@financialcorp.org",
      "password_hash": "$2b$12$k829JkL...secretHashSample9981240182",
      "balance_cents": 3500
    }
    // [48 more full customer records with plaintext emails...]
  ]
}`,
    distilledJsonSnippet: `{
  "query_summary": {
    "total_rows": 50,
    "pii_protection": "STRICT_ENFORCED",
    "redacted_fields": ["email", "password_hash"]
  },
  "statistical_distillation": {
    "balance_distribution": { "min_cents": 3500, "max_cents": 9800000, "median": 225000 },
    "sample_archetypes": [
      { "id": "usr_01J8F9", "name": "Elena R.", "email": "[REDACTED_PII_EMAIL]", "balance": "$14,500.00" },
      { "id": "usr_01J8FA", "name": "Marcus V.", "email": "[REDACTED_PII_EMAIL]", "balance": "$35.00" }
    ]
  },
  "schema_topology": {
    "foreign_keys": ["orders.user_id", "billing_profile.user_id"],
    "suggested_indexes": ["users_balance_idx"]
  }
}`,
    explanation: {
      problem: "Querying raw databases returns plaintext PII, sensitive password hashes, and repetitive rows that exhaust model token limits.",
      transformation: "PII Shield replaces emails and hashes with masked tokens; Table Distiller condenses 50 rows into statistical distributions + sample archetypes.",
      impact: "Saves 3,560 tokens (-84.7%), satisfies strict GDPR/zero-trust compliance, and provides pre-calculated math aggregates.",
    },
  },
  {
    id: "k8s-docker",
    name: "Container Inspection & Log Spam",
    icon: Server,
    rawSource: "docker.inspect_container (redis-cluster-1)",
    rawTokens: 4950,
    distilledTokens: 480,
    rawLatencyMs: 910,
    distilledLatencyMs: 18,
    issuesIdentified: [
      { label: "REDIS_PASSWORD leaked in Env array", risk: "critical" },
      { label: "AWS_ACCESS_KEY_ID in plaintext", risk: "critical" },
      { label: "10,000 lines of repeating ping logs", risk: "warning" },
    ],
    steroidsApplied: [
      "Container Env Var & Secret Masker",
      "Log Distiller & Crash Extractor",
      "Crash Loop Diagnostic Predictor",
    ],
    rawJsonSnippet: `{
  "Id": "c18a992819238129a0b12",
  "Config": {
    "Image": "redis:7.2-alpine",
    "Env": [
      "REDIS_PASSWORD=super_secret_redis_pass_9901",
      "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE",
      "NODE_ENV=production"
    ]
  },
  "State": { "Status": "restarting", "ExitCode": 137, "OOMKilled": true },
  "Logs": "[10,000 lines of repeating ping healthcheck messages...]"
}`,
    distilledJsonSnippet: `{
  "container": "redis-cluster-1 (redis:7.2-alpine)",
  "state": { "status": "OOM_KILLED", "exit_code": 137, "action_required": "Increase memory limit" },
  "sanitized_env": {
    "NODE_ENV": "production",
    "REDIS_PASSWORD": "[MASKED_CONTAINER_SECRET]",
    "AWS_ACCESS_KEY_ID": "[MASKED_AWS_KEY]"
  },
  "distilled_crash_frame": {
    "fatal_event": "Out of memory: Killed process 8412 (redis-server)",
    "suppressed_noise_lines": 9995
  }
}`,
    explanation: {
      problem: "Container crash dumps include massive stdout healthcheck noise and plain-text environmental secrets.",
      transformation: "Secrets are redacted, 10,000 log lines are reduced to the exact OOM panic frame, and remediation insights are prepended.",
      impact: "Payload reduced by 90.3%, credentials shielded from inference logs, and root cause surfaced instantly.",
    },
  },
];

export const UnfoldingTransformationDiagram: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<"unfolding" | "diff_comparison">("unfolding");

  const scenario = SCENARIOS[selectedScenarioIndex];

  // Auto-play timer for unfolding progression
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const steps = [
    {
      id: 0,
      title: "1. Raw Interception (Before)",
      badge: "Unprocessed Stream",
      description: "Intercepts raw tool output before it reaches the LLM context window.",
    },
    {
      id: 1,
      title: "2. Steroid Transformation Layer",
      badge: "Active Pipeline",
      description: "Applies zero-trust scrubbers, AST compression, and domain context enrichment.",
    },
    {
      id: 2,
      title: "3. Distilled Payload (After)",
      badge: "Supercharged Output",
      description: "Optimized, safe, compact JSON ready for precise, hallucination-free reasoning.",
    },
    {
      id: 3,
      title: "4. Multi-Agent Verification",
      badge: "Swarm Consensus",
      description: "Specialized agents verify safety, tokens, topology, and correctness.",
    },
  ];

  const savingsPercent = Math.round(
    ((scenario.rawTokens - scenario.distilledTokens) / scenario.rawTokens) * 100
  );

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-mono font-bold tracking-wider uppercase shrink-0">
              Architecture Proof
            </span>
            <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              MCP Transformation Pipeline: Before & After
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Watch how raw bloated MCP tool responses unfold into clean, zero-trust distilled intelligence.
          </p>
        </div>

        {/* Controls & Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scenario Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 max-w-full overflow-x-auto">
            {SCENARIOS.map((sc, idx) => {
              const Icon = sc.icon;
              const isSelected = selectedScenarioIndex === idx;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setCurrentStep(0);
                  }}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{sc.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle View Mode */}
          <button
            onClick={() => setViewMode((m) => (m === "unfolding" ? "diff_comparison" : "unfolding"))}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            {viewMode === "unfolding" ? (
              <>
                <Split className="w-3.5 h-3.5 shrink-0" />
                <span>Side-by-Side Diff</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>Unfolding Pipeline</span>
              </>
            )}
          </button>

          {/* Play / Pause Toggle */}
          {viewMode === "unfolding" && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-1.5 sm:p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700 shrink-0"
              title={isPlaying ? "Pause autoplay" : "Play auto-unfold sequence"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Context Weight</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              -{savingsPercent}%
            </span>
            <span className="text-[11px] text-zinc-400 line-through">
              {scenario.rawTokens.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200">
              → {scenario.distilledTokens} tokens
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Zero-Trust Neutralization</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {scenario.issuesIdentified.length} Threats Masked
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Execution Latency</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xs font-mono text-zinc-400 line-through">{scenario.rawLatencyMs}ms</span>
            <span className="text-sm sm:text-base font-mono font-bold text-sky-600 dark:text-sky-400">
              {scenario.distilledLatencyMs}ms
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-semibold">
              L2 Cache
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Hallucination Surface</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Topology Enriched
            </span>
          </div>
        </div>
      </div>

      {viewMode === "unfolding" ? (
        <div className="space-y-6">
          {/* Step Timeline Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((st) => {
              const isActive = currentStep === st.id;
              const isPast = currentStep > st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setCurrentStep(st.id);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md"
                      : isPast
                      ? "bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                      : "bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-500 border-zinc-200/60 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">{st.badge}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className="text-xs font-bold truncate">{st.title}</div>
                  {isActive && (
                    <motion.div
                      layoutId="active-step-bar"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Unfolded Stage Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Stage Explanation & Architectural Analysis */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                      Stage {currentStep + 1} Architecture Focus
                    </span>
                  </div>

                  {currentStep === 0 && (
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p className="text-zinc-600 dark:text-zinc-300">
                        The proxy captures the raw response directly from <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[11px] text-zinc-900 dark:text-zinc-100">{scenario.rawSource}</code>.
                      </p>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                        <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Detected Critical Hazards:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-rose-800 dark:text-rose-300 text-[11px]">
                          {scenario.issuesIdentified.map((iss, i) => (
                            <li key={i}>{iss.label}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p className="text-zinc-600 dark:text-zinc-300">
                        {scenario.explanation.transformation}
                      </p>
                      <div className="space-y-2">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Active Interceptor Pipeline:
                        </span>
                        <div className="space-y-1.5">
                          {scenario.steroidsApplied.map((st, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-medium text-zinc-800 dark:text-zinc-200"
                            >
                              <div className="flex items-center space-x-2">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>{st}</span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                ACTIVE
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p className="text-zinc-600 dark:text-zinc-300">
                        {scenario.explanation.impact}
                      </p>
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-emerald-900 dark:text-emerald-200">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Guaranteed Outcomes:</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] space-y-0.5">
                          <li>Secrets replaced with cryptographically safe placeholders</li>
                          <li>Boilerplate AST stripped, keeping only functional signatures</li>
                          <li>Injected topology prevents LLM from guessing relations</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p className="text-zinc-600 dark:text-zinc-300">
                        Coordinated multi-agent swarm verifies the transformed payload before delivering it to downstream model inference.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px]">
                          <span className="font-mono text-zinc-400 block text-[9px]">SECURITY VERDICT</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Redacted</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px]">
                          <span className="font-mono text-zinc-400 block text-[9px]">EFFICIENCY SCORE</span>
                          <span className="font-bold text-sky-600 dark:text-sky-400">{savingsPercent}% Compression</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : 3))}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700 whitespace-nowrap"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={() => setCurrentStep((prev) => (prev + 1) % 4)}
                    className="px-5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold transition-all cursor-pointer flex items-center space-x-2 hover:opacity-90 shadow-2xs whitespace-nowrap"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Code & JSON Payload Viewer */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl font-mono text-xs space-y-3 min-w-0 overflow-hidden">
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-zinc-400 pb-2.5 border-b border-zinc-800">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <FileCode2 className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="font-semibold text-zinc-200 text-[11px] truncate">
                      {currentStep === 0
                        ? "RAW_INTERCEPTED_STREAM.json"
                        : currentStep === 1
                        ? "INTERCEPTION_PIPELINE_FLOW.ts"
                        : "DISTILLED_SUPERCHARGED_PAYLOAD.json"}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono shrink-0 whitespace-nowrap ${
                      currentStep === 0
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : currentStep === 1
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {currentStep === 0
                      ? "RAW VULNERABLE"
                      : currentStep === 1
                      ? "PROCESSING..."
                      : "SECURE & DISTILLED"}
                  </span>
                </div>

                <div className="bg-black/70 p-3.5 rounded-xl overflow-x-auto max-h-[320px] text-[11px] leading-relaxed text-zinc-300 border border-zinc-800/80">
                  <pre className="font-mono">
                    {currentStep === 0
                      ? scenario.rawJsonSnippet
                      : currentStep === 1
                      ? `// Executing Pipeline Decorators in Parallel:
await Promise.all([
  zeroTrustSentinel.scrubSecrets(payload, { maskTokens: true }),
  astDistiller.pruneNoise(payload, { dropLockfiles: true, maxDepth: 3 }),
  domainEnricher.injectTopology(payload, { attachRiskScore: true }),
  semanticCache.put(cacheKey, payload, { ttlSeconds: 3600 })
]);`
                      : scenario.distilledJsonSnippet}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-500 pt-1">
                  <span className="truncate">
                    {currentStep === 0
                      ? `Original payload: ~${scenario.rawTokens} tokens`
                      : currentStep === 1
                      ? "Applying AST transformers..."
                      : `Optimized payload: ~${scenario.distilledTokens} tokens (-${savingsPercent}%)`}
                  </span>
                  <span className="text-zinc-400 font-mono flex items-center gap-1 shrink-0">
                    {currentStep === 0 ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 inline" />
                        <span className="text-rose-400">2 Security Flags</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 inline" />
                        <span className="text-emerald-400">Zero Residual Vulnerabilities</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Side-by-Side Diff Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
          {/* Before: Raw */}
          <div className="bg-zinc-950 border border-rose-900/30 rounded-2xl p-4 sm:p-5 space-y-2 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800 text-rose-400">
              <span className="font-bold flex items-center gap-1.5 min-w-0 truncate">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="truncate">BEFORE: Raw Unfiltered MCP</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 font-bold shrink-0 whitespace-nowrap">
                {scenario.rawTokens} Tokens
              </span>
            </div>
            <pre className="bg-black/60 p-3 rounded-xl text-[11px] text-rose-200/90 overflow-x-auto max-h-[300px] border border-rose-950">
              {scenario.rawJsonSnippet}
            </pre>
            <div className="text-[11px] text-zinc-400 space-y-1 pt-1">
              <div className="text-rose-400 font-semibold truncate">• Exposed authentication tokens & keys</div>
              <div className="text-zinc-500 truncate">• Redundant machine-generated hashes and lockfiles</div>
            </div>
          </div>

          {/* After: Distilled */}
          <div className="bg-zinc-950 border border-emerald-900/30 rounded-2xl p-4 sm:p-5 space-y-2 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800 text-emerald-400">
              <span className="font-bold flex items-center gap-1.5 min-w-0 truncate">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">AFTER: MCP Decorator Distilled</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold shrink-0 whitespace-nowrap">
                {scenario.distilledTokens} Tokens (-{savingsPercent}%)
              </span>
            </div>
            <pre className="bg-black/60 p-3 rounded-xl text-[11px] text-emerald-200/90 overflow-x-auto max-h-[300px] border border-emerald-950">
              {scenario.distilledJsonSnippet}
            </pre>
            <div className="text-[11px] text-zinc-400 space-y-1 pt-1">
              <div className="text-emerald-400 font-semibold truncate">• Cryptographically redacted credentials</div>
              <div className="text-zinc-300 truncate">• Pre-calculated domain risk & topology attached</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
