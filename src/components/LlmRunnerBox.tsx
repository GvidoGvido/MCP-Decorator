import React, { useState } from "react";
import {
  DecorationResult,
  LlmExecutionComparison,
  McpTool,
  MultiAgentSwarmResult,
} from "../types";
import {
  Play,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  Shield,
  FileCode,
  ShieldCheck,
  Layers,
  ArrowRight,
  Zap,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LlmRunnerBoxProps {
  tool: McpTool;
  decorationResult: DecorationResult;
  comparisonResult: LlmExecutionComparison | null;
  swarmResult: MultiAgentSwarmResult | null;
  isRunning: boolean;
  isRunningSwarm: boolean;
  onRunLlm: (prompt: string) => void;
  onRunSwarm: (prompt: string) => void;
}

export const LlmRunnerBox: React.FC<LlmRunnerBoxProps> = ({
  tool,
  decorationResult,
  comparisonResult,
  swarmResult,
  isRunning,
  isRunningSwarm,
  onRunLlm,
  onRunSwarm,
}) => {
  const [activeTab, setActiveTab] = useState<"dual_compare" | "multi_agent_swarm">("multi_agent_swarm");
  const [promptInput, setPromptInput] = useState(tool.suggestedPrompt || "");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-sentinel");

  const handleRun = () => {
    if (!promptInput.trim()) return;
    if (activeTab === "dual_compare") {
      if (isRunning) return;
      onRunLlm(promptInput);
    } else {
      if (isRunningSwarm) return;
      onRunSwarm(promptInput);
    }
  };

  const getAgentRoleBadge = (role: string) => {
    switch (role) {
      case "security_guardian":
        return { label: "Security Sentinel", color: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800" };
      case "payload_distiller":
        return { label: "AST Distiller", color: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" };
      case "domain_enricher":
        return { label: "Context Specialist", color: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" };
      case "verification_critic":
        return { label: "Verification Critic", color: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" };
      default:
        return { label: "Reasoning Lead", color: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" };
    }
  };

  const getAgentIcon = (role: string) => {
    switch (role) {
      case "security_guardian":
        return <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case "payload_distiller":
        return <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "domain_enricher":
        return <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case "verification_critic":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Bot className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs flex flex-col space-y-4 transition-colors">
      {/* Top Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            4. Execution Sandbox
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 uppercase tracking-wider">
            Gemini 3.7 Flash
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <button
            id="tab-multi-agent"
            onClick={() => setActiveTab("multi_agent_swarm")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "multi_agent_swarm"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Multi-Agent Swarm</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[9px] font-bold">
              4 Agents
            </span>
          </button>

          <button
            id="tab-dual-compare"
            onClick={() => setActiveTab("dual_compare")}
            className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === "dual_compare"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-slate-500" />
            <span>Dual LLM Compare</span>
          </button>
        </div>
      </div>

      {/* Prompt Bar */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Target Query / Instruction:</span>
          {tool.suggestedPrompt && (
            <button
              onClick={() => setPromptInput(tool.suggestedPrompt)}
              className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to default</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          <input
            id="llm-prompt-input"
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
            placeholder="Ask the LLM or trigger multi-agent analysis for this MCP tool..."
            className="flex-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />

          <button
            id="btn-run-sandbox"
            onClick={handleRun}
            disabled={isRunning || isRunningSwarm || !promptInput.trim()}
            className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
          >
            {isRunning || isRunningSwarm ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {activeTab === "multi_agent_swarm" ? "Orchestrating Swarm..." : "Interrogating LLM..."}
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {activeTab === "multi_agent_swarm" ? "Execute Swarm" : "Test Dual LLM"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: MULTI-AGENT SWARM VIEW */}
      {activeTab === "multi_agent_swarm" && (
        <div className="space-y-4 pt-1">
          {swarmResult ? (
            <div className="space-y-4">
              {/* Swarm Pipeline Stepper Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {swarmResult.swarmAgents.map((agent, idx) => {
                  const roleMeta = getAgentRoleBadge(agent.agentRole);
                  const isSelected = selectedAgentId === agent.agentId;
                  return (
                    <button
                      key={agent.agentId}
                      onClick={() => setSelectedAgentId(agent.agentId)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs"
                          : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100/60 dark:hover:bg-slate-800/70"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1.5">
                        <div className="flex items-center space-x-1.5">
                          {getAgentIcon(agent.agentRole)}
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {agent.agentName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {agent.durationMs}ms
                        </span>
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border mb-1.5 ${roleMeta.color}`}
                      >
                        {roleMeta.label}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {agent.contribution}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Selected Agent Findings & Lead Synthesis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Agent Trace Inspector */}
                <div className="lg:col-span-1 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Agent Micro-Findings</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      VERIFIED PASS
                    </span>
                  </div>

                  {(() => {
                    const currentAgent =
                      swarmResult.swarmAgents.find((a) => a.agentId === selectedAgentId) ||
                      swarmResult.swarmAgents[0];
                    return (
                      <div className="space-y-2.5">
                        <div className="flex items-center space-x-2">
                          {getAgentIcon(currentAgent.agentRole)}
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">
                            {currentAgent.agentName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {currentAgent.contribution}
                        </p>
                        <div className="space-y-1.5 pt-1">
                          {currentAgent.findings.map((f, i) => (
                            <div
                              key={i}
                              className="text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-start space-x-1.5"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Primary Reasoner Consensus Box */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 rounded-xl border border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500/10 dark:ring-indigo-500/20 p-4 space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/60 text-xs">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-indigo-900 dark:text-indigo-200">
                          Primary Reasoner (Armed with Swarm Decorated Context)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                        Consensus: {swarmResult.consensusVerdict}
                      </span>
                    </div>

                    <div className="pt-2 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                      {swarmResult.primaryReasonerOutput}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Swarm Latency: ~{swarmResult.totalSwarmLatencyMs}ms</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Tokens Saved: ~{swarmResult.tokensSavedTotal}</span>
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono">
                      Engine: {swarmResult.mode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <Users className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mx-auto opacity-80" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Autonomous Multi-Agent Interception Pipeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Click <strong className="text-slate-800 dark:text-slate-200">"Execute Swarm"</strong> to deploy our 4 specialized agents (Zero-Trust Sentinel, AST Distiller, Domain Specialist, & Lead Reasoner) on this MCP tool stream.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DUAL LLM COMPARE VIEW */}
      {activeTab === "dual_compare" && (
        <div className="space-y-3 pt-1">
          {comparisonResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Raw MCP Response Box */}
              <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">Without Decorator (Raw MCP)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                      {comparisonResult.rawResult.estimatedTokens} tokens
                    </span>
                  </div>

                  <div className="pt-2 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                    {comparisonResult.rawResult.text}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Latency: ~{comparisonResult.rawResult.latencyMs}ms</span>
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">Unfiltered Context</span>
                </div>
              </div>

              {/* Decorated MCP Response Box */}
              <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-indigo-200 dark:border-indigo-800/80 ring-1 ring-indigo-500/10 dark:ring-indigo-500/20 p-4 space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/60 text-xs">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-bold text-indigo-900 dark:text-indigo-200">With MCP Decorator (On Steroids)</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 px-2 py-0.5 rounded">
                      {comparisonResult.decoratedResult.estimatedTokens} tokens (
                      {Math.max(
                        0,
                        Math.round(
                          ((comparisonResult.rawResult.estimatedTokens -
                            comparisonResult.decoratedResult.estimatedTokens) /
                            Math.max(1, comparisonResult.rawResult.estimatedTokens)) *
                            100
                        )
                      )}
                      % saved)
                    </span>
                  </div>

                  <div className="pt-2 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    {comparisonResult.decoratedResult.text}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 font-medium">
                    <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>Latency: ~{comparisonResult.decoratedResult.latencyMs}ms</span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Zero Leaks • Enriched</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
              <Bot className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click <strong className="text-slate-800 dark:text-slate-200">"Test Dual LLM"</strong> to see how a single LLM consumes the Raw MCP payload versus the Decorated MCP.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
