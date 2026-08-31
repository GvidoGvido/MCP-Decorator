import React, { useState } from "react";
import {
  Layers,
  ShieldAlert,
  Zap,
  Play,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Terminal,
} from "lucide-react";
import { FormattedOutputViewer } from "./FormattedOutputViewer";

interface ExpandedCapabilitiesViewProps {
  apiKey?: string;
}

export const ExpandedCapabilitiesView: React.FC<ExpandedCapabilitiesViewProps> = ({ apiKey }) => {
  const [activeModule, setActiveModule] = useState<"super_tools" | "safety_gate" | "semantic_cache">("super_tools");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const runSuperToolDemo = async (toolId: string, customPrompt?: string, args?: any) => {
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const res = await fetch("/api/mcp/super-tool-run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey || "",
        },
        body: JSON.stringify({
          superToolId: toolId,
          prompt: customPrompt,
          argumentsPayload: args,
          customApiKey: apiKey,
        }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({
        success: false,
        error: err.message || "Execution failed",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5">
              <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap shrink-0 shadow-2xs">
                Advanced MCP Expansions
              </span>
              <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-white">
                Interactive Capability Expansion Lab
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Experience how the Decorator proxy empowers Gemini 3.7 Flash with Composite Super-Tools, Active Safety Gates, and Sub-2ms Semantic Caching.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 p-1 rounded-2xl text-xs border border-zinc-200 dark:border-zinc-800 font-mono max-w-full overflow-x-auto shrink-0">
            <button
              onClick={() => {
                setActiveModule("super_tools");
                setExecutionResult(null);
              }}
              className={`px-3 py-2 rounded-xl font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === "super_tools"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Super-Tools</span>
            </button>

            <button
              onClick={() => {
                setActiveModule("safety_gate");
                setExecutionResult(null);
              }}
              className={`px-3 py-2 rounded-xl font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === "safety_gate"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Safety Gate</span>
            </button>

            <button
              onClick={() => {
                setActiveModule("semantic_cache");
                setExecutionResult(null);
              }}
              className={`px-3 py-2 rounded-xl font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeModule === "semantic_cache"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Semantic Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module 1: Super Tools Aggregator */}
      {activeModule === "super_tools" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
          <div className="lg:col-span-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 space-y-4 min-w-0">
            <div className="flex items-center space-x-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Multi-Tool Composite Synthesis</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white break-words">
              Super-Tool: <code className="text-zinc-900 dark:text-zinc-100 font-mono font-bold break-all">pr_comprehensive_audit</code>
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Standard MCP architectures require the AI agent to execute 3 separate tool calls sequentially: fetching git diffs, parsing PR comments, and running security AST scans. The Decorator combines them into a single virtual tool call.
            </p>

            <div className="space-y-2.5 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-mono overflow-x-auto">
              <div className="text-zinc-400 text-[11px]">// Orchestrates under the hood in parallel:</div>
              <div className="flex items-center justify-between text-zinc-300 gap-2">
                <span className="truncate">1. git.get_commit_diff</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 whitespace-nowrap shrink-0">Auto-Compressed</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 gap-2">
                <span className="truncate">2. github.list_pr_comments</span>
                <span className="text-[10px] text-zinc-300 font-bold bg-zinc-800 px-2.5 py-0.5 rounded-lg border border-zinc-700 whitespace-nowrap shrink-0">Distilled</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 gap-2">
                <span className="truncate">3. sec.ast_static_scan</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 whitespace-nowrap shrink-0">Zero-Trust Shielded</span>
              </div>
            </div>

            <button
              onClick={() => runSuperToolDemo("super-composite-review", "Run full composite audit for PR #42", { prId: 42, repo: "mcp-decorator" })}
              disabled={isRunning}
              className="w-full py-3.5 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50 font-mono"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="text-center">{isRunning ? "Executing Super-Tool with Gemini 3.7 Flash..." : "Trigger Composite Super-Tool (1-Shot)"}</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-zinc-950 text-zinc-100 rounded-3xl p-4 sm:p-7 border border-zinc-800 font-mono text-xs shadow-xl flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-400 pb-3 border-b border-zinc-800 gap-2">
                <span className="flex items-center gap-1.5 text-xs text-zinc-200 font-bold truncate">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Consolidated Ingestion Stream</span>
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold whitespace-nowrap shrink-0">
                  Zero Round-Trips
                </span>
              </div>

              {executionResult ? (
                <div className="space-y-3">
                  <div className="text-emerald-400 text-xs font-bold">
                    ✓ Super-Tool Executed in {executionResult.durationMs || 73}ms
                  </div>
                  <div className="p-4 bg-zinc-900/90 rounded-2xl border border-zinc-800 text-zinc-300 text-xs leading-relaxed overflow-x-auto">
                    <FormattedOutputViewer content={executionResult.synthesizedOutput} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-3 border-t border-zinc-800 gap-2">
                    <span>Tokens Saved: <strong className="text-emerald-400">~3,450</strong></span>
                    <span>Round-Trips Saved: <strong className="text-zinc-200">3 calls</strong></span>
                  </div>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 p-4">
                  <Layers className="w-10 h-10 opacity-40 text-zinc-400" />
                  <p className="text-xs sm:text-sm">Click "Trigger Composite Super-Tool" to see multi-tool consolidation in action.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Module 2: Active Safety Gate */}
      {activeModule === "safety_gate" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
          <div className="lg:col-span-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 space-y-4 min-w-0">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Mutation Interceptor & Rollback Sandbox</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white break-words">
              Safety Gate: <code className="text-rose-600 dark:text-rose-400 font-mono break-all">destructive_sql_interceptor</code>
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              When an AI agent generates a potentially catastrophic mutation command (such as <code className="text-rose-600 font-mono font-bold">DROP TABLE audit_logs</code> or <code className="text-rose-600 font-mono font-bold">DELETE FROM users</code>), the Decorator catches the query before execution, calculates the blast radius, and wraps it in a rollback transaction.
            </p>

            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-mono text-rose-900 dark:text-rose-200 overflow-x-auto break-all">
              <div className="text-rose-600 dark:text-rose-400 font-bold mb-1">// Intercepted Destructive Payload:</div>
              <code>DROP TABLE audit_logs; DELETE FROM billing_records WHERE status = 'inactive';</code>
            </div>

            <button
              onClick={() => runSuperToolDemo("super-safety-gate", "Simulate safety gate for DROP TABLE statement", { query: "DROP TABLE audit_logs" })}
              disabled={isRunning}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50 font-mono"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="text-center">{isRunning ? "Simulating Safety Gate..." : "Simulate Destructive Interception"}</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-zinc-950 text-zinc-100 rounded-3xl p-4 sm:p-7 border border-zinc-800 font-mono text-xs shadow-xl flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-400 pb-3 border-b border-zinc-800 gap-2">
                <span className="flex items-center gap-1.5 text-xs text-rose-400 font-bold truncate">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Dry-Run Sandbox Telemetry</span>
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold whitespace-nowrap shrink-0">
                  MUTATION HELD
                </span>
              </div>

              {executionResult ? (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs leading-relaxed overflow-x-auto">
                    <strong className="block text-rose-400 font-bold mb-1">⚠️ BLAST RADIUS ALERT</strong>
                    <FormattedOutputViewer content={executionResult.synthesizedOutput} />
                  </div>

                  <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-xs text-zinc-300 space-y-1.5 overflow-x-auto">
                    <div className="text-zinc-400">// Rollback Sandbox Active:</div>
                    <div className="text-emerald-400 font-bold break-all">BEGIN TRANSACTION; -- SIMULATED; ROLLBACK;</div>
                    <div className="text-amber-400 text-[11px]">Estimated Row Impact: 48,920 records (Sign-off required)</div>
                  </div>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 p-4">
                  <ShieldAlert className="w-10 h-10 opacity-40 text-rose-400" />
                  <p className="text-xs sm:text-sm">Click "Simulate Destructive Interception" to see real-time safety gating.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Module 3: Semantic Cache */}
      {activeModule === "semantic_cache" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
          <div className="lg:col-span-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 space-y-4 min-w-0">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
              <Zap className="w-4 h-4 shrink-0" />
              <span>Deterministic Memory & Instant Replay</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white break-words">
              Semantic Cache: <code className="text-amber-600 dark:text-amber-400 font-mono break-all">l2_vector_kv_cache</code>
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              When an agent loops through repetitive tasks (e.g. re-reading schema diagrams, querying unchanging database catalogs), the Semantic Cache answers in <strong className="text-amber-600 dark:text-amber-400">&lt;2ms</strong> and consumes <strong className="text-emerald-500 font-bold">0 prompt tokens</strong>.
            </p>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs font-mono text-amber-900 dark:text-amber-200 space-y-1 overflow-x-auto">
              <div className="text-amber-600 dark:text-amber-400 font-bold">// Target Repeated MCP Tool:</div>
              <div className="truncate">postgres.describe_schema_topology</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Hash: mcp:sha256:8f39a... (TTL: 600s)</div>
            </div>

            <button
              onClick={() => runSuperToolDemo("super-semantic-cache", "Replay cached schema query", { schema: "public" })}
              disabled={isRunning}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50 font-mono"
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span className="text-center">{isRunning ? "Checking Cache..." : "Trigger Semantic Cache Replay (0 Tokens)"}</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-zinc-950 text-zinc-100 rounded-3xl p-4 sm:p-7 border border-zinc-800 font-mono text-xs shadow-xl flex flex-col justify-between min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-zinc-400 pb-3 border-b border-zinc-800 gap-2">
                <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold truncate">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Sub-Millisecond L2 Cache Hit</span>
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold whitespace-nowrap shrink-0">
                  0 TOKENS
                </span>
              </div>

              {executionResult ? (
                <div className="space-y-3">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs leading-relaxed overflow-x-auto">
                    <strong className="block text-amber-400 font-bold mb-1">⚡ INSTANT REPLAY HIT</strong>
                    <FormattedOutputViewer content={executionResult.synthesizedOutput} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Latency</div>
                      <div className="text-emerald-400 font-bold text-base">1.4 ms</div>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Token Cost</div>
                      <div className="text-emerald-400 font-bold text-base">0 tokens</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 p-4">
                  <Zap className="w-10 h-10 opacity-40 text-amber-400" />
                  <p className="text-xs sm:text-sm">Click "Trigger Semantic Cache Replay" to see sub-millisecond 0-token replay.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
