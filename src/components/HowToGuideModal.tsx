import React, { useState } from "react";
import {
  Shield,
  Zap,
  Sparkles,
  Layers,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Cpu,
  BookOpen,
  X,
  Copy,
  Check,
  Terminal,
  HelpCircle,
  Play,
  RotateCcw,
  Compass,
  FileCode,
  Flame,
  ShieldAlert,
  Database,
  Github,
  CreditCard,
  Cloud,
  ChevronRight,
  Eye,
  Bot,
  Network,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HowToGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStudio?: () => void;
  onOpenChat?: () => void;
}

type GuideTab = "overview" | "steps" | "examples" | "faq";

export const HowToGuideModal: React.FC<HowToGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToStudio,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>("overview");
  const [activeExample, setActiveExample] = useState<"github" | "database" | "stripe" | "supertools">("github");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col text-zinc-900 dark:text-zinc-100 overflow-hidden relative shadow-2xl"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-md shrink-0 border border-zinc-800 dark:border-zinc-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight truncate">
                  How MCP Decorator Works
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold shrink-0">
                  Visual Guide
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                Zero jargon. Step-by-step visual examples so anyone can supercharge their AI tools.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 shrink-0 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "overview"
                ? "border-zinc-900 text-zinc-950 dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. The Core Idea (ELI5)</span>
          </button>

          <button
            onClick={() => setActiveTab("steps")}
            className={`px-3 py-2 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "steps"
                ? "border-zinc-900 text-zinc-950 dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. 3-Step Walkthrough</span>
          </button>

          <button
            onClick={() => setActiveTab("examples")}
            className={`px-3 py-2 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "examples"
                ? "border-zinc-900 text-zinc-950 dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>3. Before vs After Examples</span>
          </button>

          <button
            onClick={() => setActiveTab("faq")}
            className={`px-3 py-2 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "faq"
                ? "border-zinc-900 text-zinc-950 dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Quick FAQ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          {/* TAB 1: THE CORE IDEA */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* High Level Analogy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm sm:text-base">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>The Simple Analogy: A Water Filter for AI Tools</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  Imagine your AI (Cursor, Claude, or ChatGPT) drinking straight from a dirty tap. Raw tools return{" "}
                  <strong>4,000 lines of messy JSON</strong>, <strong>exposed password tokens</strong>, and{" "}
                  <strong>confusing ID numbers</strong> with no context.
                </p>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  <strong>MCP Decorator</strong> is the inline smart filter. It intercepts raw tool responses on the fly, strips out the junk (saving 70% of token cost), scrubs sensitive passwords, and enriches data with deep context before your AI sees it.
                </p>
              </div>

              {/* Visual High-Level Diagram */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 sm:p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Visual Pipeline: What Happens Behind the Scenes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Box 1 */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <span className="text-[10px] font-mono text-red-500 font-bold">Unfiltered</span>
                    </div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Raw MCP Tool</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      GitHub, Postgres, or AWS returns raw CLI output containing verbose nulls, bearer tokens & bare IDs.
                    </p>
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px]">
                      🔴 4,200 Tokens &bull; Exposed `ghp_***`
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="p-4 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border border-zinc-900 dark:border-white space-y-2.5 relative shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 dark:text-emerald-600 font-bold">Interception</span>
                    </div>
                    <div className="font-bold text-xs">MCP Decorator Proxy</div>
                    <p className="text-[11px] text-zinc-300 dark:text-zinc-700 leading-relaxed">
                      Zero-Trust Sentinel sanitizes secrets, AST Distiller prunes bloat, and Domain Specialist injects graph context.
                    </p>
                    <div className="p-2 rounded-lg bg-white/10 dark:bg-black/10 font-mono text-[10px] font-bold">
                      ⚡ -70% Weight &bull; SHA256 Signed
                    </div>
                  </div>

                  {/* Box 3 */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Clean & Fast</span>
                    </div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Your LLM Client</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Claude, Cursor, or Gemini receives a crystal-clear, safe payload. Generates instant zero-hallucination verdict.
                    </p>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                      🟢 1,180 Tokens &bull; 0 Secrets Leaked
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Feature Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Zero-Trust Sentinel</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                      Deterministic AST regex scrubs AWS keys, JWTs, Stripe tokens, and passwords from logs.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">AST Token Distiller</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                      Strips empty objects, null keys, and repetitive lockfile chunks for massive token savings.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Composite Super-Tools</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                      Combines 3–5 low-level tools into 1 atomic call, eliminating multi-turn agent latency.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Active Safety Gates</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                      Intercepts destructive actions (`DROP TABLE`, `git push --force`) and runs sandbox simulations first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3-STEP WALKTHROUGH */}
          {activeTab === "steps" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Select an MCP Source & Tool</h4>
                      <p className="text-xs text-zinc-500">Pick any preloaded MCP or import your own</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Choose from GitHub, PostgreSQL, AWS CloudWatch, Stripe Payments, or click <strong>"+ Custom MCP"</strong> to paste any MCP JSON-RPC configuration. Select a specific tool (e.g. `get_commit_diff` or `execute_sql`).
                  </p>
                  <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800">GitHub</span>
                    <span>➔</span>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800">get_commit_diff</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Toggle Supercharged Decorator Filters</h4>
                      <p className="text-xs text-zinc-500">Activate security, compression, and context enrichers</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    In the <strong>Decorator Pipeline Builder</strong>, click the toggle switches to turn on AST Distillation, Zero-Trust Secret Scrubbing, Pre-Flight Context, or Semantic Cache. Look at the <strong>Live Inspector</strong> below to see token savings and redacted secrets update in real-time.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Test with Gemini 3.7 Flash or Export</h4>
                      <p className="text-xs text-zinc-500">Verify output side-by-side or launch a 5-Agent Swarm</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    In the Execution Sandbox, click <strong>"Run Dual LLM Comparison"</strong> or <strong>"Launch 5-Agent Swarm"</strong> to watch how your decorated payload produces faster, cleaner, hallucination-free reasoning. When satisfied, click <strong>"Export Config"</strong> in the top header to copy 1-click JSON for Cursor or Claude Desktop!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BEFORE VS AFTER EXAMPLES */}
          {activeTab === "examples" && (
            <div className="space-y-4 animate-fade-in">
              {/* Example Switcher Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveExample("github")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeExample === "github"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Diff</span>
                </button>

                <button
                  onClick={() => setActiveExample("database")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeExample === "database"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>PostgreSQL</span>
                </button>

                <button
                  onClick={() => setActiveExample("stripe")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeExample === "stripe"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Stripe API</span>
                </button>

                <button
                  onClick={() => setActiveExample("supertools")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    activeExample === "supertools"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Super-Tools</span>
                </button>
              </div>

              {/* Side-by-Side Visual Card */}
              {activeExample === "github" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      <span>BEFORE: Raw MCP Output</span>
                      <span>4,200 Tokens</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-red-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div className="text-zinc-500">// Contains exposed secret token:</div>
                      <div>{`{"diff": "@@ -12,4 +12,4 @@ const token = 'ghp_9281a8f9a2b84...'"}`}</div>
                      <div className="text-zinc-500">// 3,000 lines of package-lock.json diff noise</div>
                      <div>{`{"null_fields": [null, null, null, {}]}`}</div>
                    </div>
                    <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Leaked authorization token + excessive token burn</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span>AFTER: Decorated Payload</span>
                      <span>1,260 Tokens (-70%)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div className="text-emerald-400">// Token masked safely:</div>
                      <div>{`{"diff": "const token = 'ghp_****************' (REDACTED)"}`}</div>
                      <div className="text-emerald-400">// Injected context & pruned diff:</div>
                      <div>{`{"pr_context": {"branch": "feat/auth", "impact": "LOW"}}`}</div>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Zero secrets leaked + 70% faster model response</span>
                    </div>
                  </div>
                </div>
              )}

              {activeExample === "database" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      <span>BEFORE: Direct SQL Execution</span>
                      <span>High Risk</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-red-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div>{`SQL: "DROP TABLE users_archive;"`}</div>
                      <div className="text-red-400 mt-1">STATUS: Executed directly on production</div>
                      <div className="text-zinc-500">Rows permanently deleted: 48,200</div>
                    </div>
                    <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Catastrophic data loss with zero undo capability</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span>AFTER: Active Safety Gate Sandbox</span>
                      <span>100% Safe</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div className="text-amber-400">INTERCEPTED: Mutation detected</div>
                      <div className="text-emerald-400">SIMULATION: Ran inside ROLLBACK transaction</div>
                      <div>{`{"blast_radius": "48,200 rows", "dry_run": "PASS"}`}</div>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Requires cryptographic sign-off before actual commit</span>
                    </div>
                  </div>
                </div>
              )}

              {activeExample === "stripe" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      <span>BEFORE: Raw Stripe Customers</span>
                      <span>PII Violation</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-red-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div>{`{"card_last4": "4242", "customer_ssn": "981-22-****"}`}</div>
                      <div>{`{"billing_address": "742 Evergreen Terrace..."}`}</div>
                    </div>
                    <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>GDPR/SOC2 violation by leaking customer PII to LLM</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span>AFTER: Masked & Distilled</span>
                      <span>SOC2 Compliant</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div>{`{"customer_hash": "cust_anon_9f82"}`}</div>
                      <div>{`{"subscription_status": "active", "mrr": "$120"}`}</div>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>All PII scrubbed while preserving analytics context</span>
                    </div>
                  </div>
                </div>
              )}

              {activeExample === "supertools" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      <span>BEFORE: 4 Atomic Round Trips</span>
                      <span>12.4s Total Latency</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-red-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div>Call 1: `git.get_diff` ➔ 2.8s</div>
                      <div>Call 2: `github.list_pr_comments` ➔ 3.1s</div>
                      <div>Call 3: `security.ast_scan` ➔ 3.2s</div>
                      <div>Call 4: `jira.link_issue` ➔ 3.3s</div>
                    </div>
                    <div className="text-[11px] text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Slow serial tool execution drains battery and tokens</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <span>AFTER: 1 Composite Super-Tool</span>
                      <span>1.8s (Parallel Batch)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                      <div className="text-emerald-400">Single Call: `super_code_review_and_audit`</div>
                      <div className="text-zinc-400">Under the hood: Executes all 4 in parallel</div>
                      <div className="text-emerald-300 font-bold">1 LLM round-trip instead of 4</div>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>6x faster workflow execution for agents</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUICK FAQ */}
          {activeTab === "faq" && (
            <div className="space-y-3 animate-fade-in text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>How do I export this to Cursor or Claude Desktop?</span>
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Click the <strong>"Export Config"</strong> button in the top right header. You can download a standard `mcp_servers.json` or Python / Node.js wrapper that configures your Claude Desktop or Cursor IDE to automatically route MCP traffic through the decorator.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Do I need to pay or provide a Gemini API key?</span>
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  No! The app runs fully local simulations out-of-the-box. If you want to connect live AI intelligence via <strong>Gemini 3.7 Flash</strong>, simply click <strong>"API Key"</strong> in the top header and enter your free key.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Can I create custom decorators for my own internal tools?</span>
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Yes! Click <strong>"AI Synthesizer"</strong> in the top bar. You can describe any rule in plain English (e.g. <em>"Mask all customer email addresses and calculate diff complexity"</em>) and Gemini AI will write and attach the TypeScript AST filter for you.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>What is the 5-Agent Swarm?</span>
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Instead of one generic LLM pass, the swarm runs 5 specialized autonomous agents (Zero-Trust Sentinel, AST Distiller, Domain Specialist, Global Scout, and Cryptographic Critic) to transform the tool packet with mathematical precision.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-zinc-500">
            <span>Need workflow advice?</span>
            {onOpenChat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Copilot</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            {onJumpToStudio && (
              <button
                onClick={() => {
                  onClose();
                  onJumpToStudio();
                }}
                className="px-5 py-2 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Open Pipeline Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
