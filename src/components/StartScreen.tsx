import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Bot,
  Lock,
  ArrowRight,
  GitBranch,
  Database,
  Activity,
  Terminal,
  Key,
  Github,
  CheckCircle2,
  Code2,
  Cpu,
  Star,
  ExternalLink,
  Compass,
  Radar,
  Radio,
  FileCode2,
  Globe,
  BookOpen,
  HelpCircle,
  Shield,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";
import { PRESET_MCPS } from "../data/presetMcps";
import { UnfoldingTransformationDiagram } from "./UnfoldingTransformationDiagram";

interface StartScreenProps {
  onEnterStudio: (sourceId?: string, toolId?: string) => void;
  onOpenApiKeyModal: () => void;
  onOpenRadar?: () => void;
  onOpenHowTo?: () => void;
  onOpenChat?: () => void;
  hasApiKey: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onEnterStudio,
  onOpenApiKeyModal,
  onOpenRadar,
  onOpenHowTo,
  onOpenChat,
  hasApiKey,
}) => {
  const [activeCapabilityTab, setActiveCapabilityTab] = useState<
    "super_tools" | "preflight_context" | "safety_gate" | "semantic_cache" | "zero_trust"
  >("super_tools");

  const capabilities = [
    {
      id: "super_tools" as const,
      name: "Composite Super-Tools",
      badge: "Zero Round-Trips",
      icon: Layers,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
      headline: "Aggregates 3–5 low-level MCP tools into a single atomic action.",
      problem: "Standard MCP servers only provide raw atomic tools (e.g. git_diff, list_pr_comments, file_read). The LLM is forced to make 4 sequential round-trips to complete one task.",
      solution: "MCP Decorator registers virtual Super-Tools that orchestrate underlying tools in parallel under the hood, delivering fully consolidated intelligence in a single shot.",
      demoPreview: {
        toolName: "super_code_review_and_security_audit",
        collapsedCalls: ["git.get_diff", "github.list_pr_comments", "sec.ast_scan"],
        savings: "4 round-trips → 1 atomic step (Saved 3,450 tokens)",
      },
    },
    {
      id: "preflight_context" as const,
      name: "Pre-Flight Context Chaining",
      badge: "Deep Intelligence",
      icon: Sparkles,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
      headline: "Pre-computes relational graphs, schema docs, and blast radius before LLM ingestion.",
      problem: "Low-level tools return isolated IDs (commit SHAs, database foreign keys) without semantic context, leading to LLM hallucinations or follow-up tool calls.",
      solution: "The Decorator executes zero-latency side-queries, appending relational models, table dependencies, and blast radius metrics directly into the tool response payload.",
      demoPreview: {
        toolName: "database.query_users_table",
        injectedContext: ["Foreign key resolved: orders -> billing_profile", "AST Blast Radius: 4 services affected", "Schema documentation attached"],
        savings: "Eliminates 3 follow-up database queries",
      },
    },
    {
      id: "safety_gate" as const,
      name: "Active Safety Gates & Dry-Runs",
      badge: "Mutation Guard",
      icon: ShieldCheck,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
      headline: "Intercepts destructive operations and runs isolated rollback simulations first.",
      problem: "Standard MCP tools execute commands immediately. An accidental DROP TABLE or force-push permanently corrupts production.",
      solution: "The Decorator parses AST commands for mutations, wraps destructive queries in an isolated rollback transaction sandbox, and requires cryptographic sign-off before actual execution.",
      demoPreview: {
        toolName: "postgres.execute_sql (DROP TABLE audit_logs)",
        actionTaken: "BLOCKED & SIMULATED",
        blastRadius: "Impact: 48,920 rows. Wrapped in ROLLBACK sandbox.",
        savings: "100% protection against catastrophic data loss",
      },
    },
    {
      id: "semantic_cache" as const,
      name: "Semantic Cache & Instant Replay",
      badge: "Sub-2ms Replay",
      icon: Zap,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
      headline: "Caches deterministic tool responses for sub-millisecond replay at 0 token cost.",
      problem: "Iterative AI agents repeatedly request identical schema reads or config files, racking up latency and token costs.",
      solution: "In-memory L2 semantic cache intercepts repeated requests and returns cached results in <2ms consuming 0 prompt tokens.",
      demoPreview: {
        toolName: "github.get_repo_structure",
        cacheStatus: "CACHE HIT (TTL: 600s)",
        latency: "1.4 ms (was 420 ms)",
        savings: "0 tokens consumed (100% cost reduction)",
      },
    },
    {
      id: "zero_trust" as const,
      name: "Zero-Trust Sentinel & AST Distiller",
      badge: "-70% Token Weight",
      icon: Lock,
      color: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
      headline: "Masks leaked API keys/PII and strips 60-80% of JSON boilerplate noise.",
      problem: "Raw CLI and JSON outputs leak bearer tokens, passwords, and 1000s of lines of null attributes into the LLM prompt.",
      solution: "Autonomous Zero-Trust Sentinel redacts sensitive credentials and the AST Distiller prunes redundant fields before model ingestion.",
      demoPreview: {
        toolName: "aws_cloudwatch.get_log_events",
        redacted: ["AWS_SECRET_ACCESS_KEY masked", "Bearer ghp_*** sanitized"],
        compression: "3,420 tokens → 1,090 tokens (68% cut)",
        savings: "Fastest response time + complete zero-trust security",
      },
    },
  ];

  const currentCap = capabilities.find((c) => c.id === activeCapabilityTab) || capabilities[0];

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in">
      {/* Hero Section - Profound Understated Architectural Design */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 sm:p-10 lg:p-12 text-center transition-all duration-300 shadow-xl">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] sm:text-xs font-mono font-medium backdrop-blur-md max-w-full">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Autonomous Interception & Transformation Proxy for MCP</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-[1.15]">
            Supercharge MCP Tools <br className="hidden sm:inline" />
            <span className="text-zinc-600 dark:text-zinc-400">
              Before They Reach Your LLM
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Standard MCP tools return bloated JSON, leak secrets, and require 4+ round-trips. 
            <span className="font-semibold text-zinc-900 dark:text-zinc-100"> MCP Decorator</span> intercepts tool calls to condense payloads by 70–85%, neutralize credentials, and synthesize high-order composite actions.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-3 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 max-w-3xl mx-auto">
            <button
              id="hero-launch-studio"
              onClick={() => onEnterStudio()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.98] border border-zinc-800 dark:border-zinc-200"
            >
              <span>Launch Pipeline Studio</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {onOpenHowTo && (
              <button
                id="hero-open-how-to-guide"
                onClick={onOpenHowTo}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>How-To Guide</span>
              </button>
            )}

            {onOpenChat && (
              <button
                id="hero-open-ai-copilot"
                onClick={onOpenChat}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Bot className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <span>Ask AI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </button>
            )}

            {onOpenRadar && (
              <button
                id="hero-open-mcp-radar"
                onClick={onOpenRadar}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300/80 dark:border-zinc-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Compass className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <span>Trending MCP Radar</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </button>
            )}

            <button
              id="hero-configure-api-key"
              onClick={onOpenApiKeyModal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/80 dark:border-zinc-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Key className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <span>{hasApiKey ? "Gemini Key: Active" : "API Key"}</span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${hasApiKey ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
            </button>

            <a
              href="https://github.com/GvidoGvido/MCP-Decorator"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/80 dark:border-zinc-700 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Github className="w-4 h-4 shrink-0" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* NEW: Interactive Unfolding MCP Transformation Diagram (Before & After) */}
      <UnfoldingTransformationDiagram />

      {/* High-Level Architecture Clearance Section: How this Expands MCP Capabilities */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                Autonomous Interception
              </span>
              <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                How MCP Decorator Solves Core MCP Limitations
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Select any capability below to see the architectural breakdown and live proxy transform.
            </p>
          </div>
        </div>

        {/* Capability Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            const isSelected = activeCapabilityTab === cap.id;
            return (
              <button
                key={cap.id}
                onClick={() => setActiveCapabilityTab(cap.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-w-0 ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md"
                    : "bg-zinc-50/70 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-2">
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950" : "bg-zinc-200 dark:bg-zinc-800"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap shrink-0 max-w-[120px] truncate ${
                    isSelected
                      ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-900 border-zinc-700 dark:border-zinc-300"
                      : "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                  }`}>
                    {cap.badge}
                  </span>
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2 text-left">{cap.name}</div>
              </button>
            );
          })}
        </div>

        {/* Active Capability Deep Dive Card */}
        <motion.div
          key={currentCap.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center"
        >
          <div className="lg:col-span-7 space-y-4 text-xs min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-tight">
                {currentCap.headline}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200">
                <span className="font-bold block text-[11px] font-mono uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1">
                  The Limitation in Standard MCP:
                </span>
                <p className="leading-relaxed text-xs break-words">{currentCap.problem}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                  How MCP Decorator Supercharges It:
                </span>
                <p className="leading-relaxed text-xs break-words">{currentCap.solution}</p>
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 font-mono text-[11px] min-w-0 overflow-hidden">
            <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Interception Transform</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Live Pipeline</span>
            </div>

            <div className="bg-black/60 p-3.5 rounded-xl overflow-x-auto space-y-2 text-[11px] border border-zinc-800/80">
              <div className="text-zinc-400">// Raw MCP Invocation:</div>
              <div className="text-zinc-200 font-bold truncate">{currentCap.demoPreview.toolName}</div>
              <div className="text-zinc-400">// Transformed Output:</div>
              <div className="text-emerald-400 font-semibold">{currentCap.demoPreview.savings}</div>
            </div>

            <button
              onClick={() => onEnterStudio()}
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <span>Inspect in Pipeline Studio</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Launch Presets Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Launch Pre-Configured MCP Workspaces
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Jump straight into tested real-world schemas with ready-to-run steroids
            </p>
          </div>
          <button
            onClick={() => onEnterStudio()}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 cursor-pointer font-mono transition-colors whitespace-nowrap"
          >
            <span>Open Custom Studio</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_MCPS.map((source) => {
            return (
              <div
                key={source.id}
                onClick={() => onEnterStudio(source.id, source.tools[0]?.id)}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 group-hover:scale-105 transition-transform">
                      {source.category === "vcs" ? (
                        <GitBranch className="w-4 h-4" />
                      ) : source.category === "database" ? (
                        <Database className="w-4 h-4" />
                      ) : source.category === "monitoring" ? (
                        <Activity className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono whitespace-nowrap">
                      {source.tools.length} Tools
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {source.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {source.tagline}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-zinc-200/60 dark:border-zinc-800 mt-3.5 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 dark:text-zinc-500 font-medium whitespace-nowrap">
                    {source.availableDecorators.length} Steroids
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono whitespace-nowrap">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

