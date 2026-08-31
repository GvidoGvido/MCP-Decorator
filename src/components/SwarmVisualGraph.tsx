import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileCode,
  Sparkles,
  Compass,
  CheckCircle2,
  Bot,
  ArrowRight,
  Zap,
  Clock,
  Activity,
  Layers,
  Check,
  AlertTriangle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Eye,
  Radio,
  GitBranch,
  Network,
  Maximize2,
  Workflow,
  Lock,
  ArrowDown,
  Terminal,
  Cpu,
  CornerDownRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SwarmAgent } from "../types";

interface SwarmVisualGraphProps {
  agents: SwarmAgent[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  isRunning?: boolean;
  totalLatencyMs?: number;
  tokensSaved?: number;
  onOpenRadar?: () => void;
}

export const SwarmVisualGraph: React.FC<SwarmVisualGraphProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  isRunning = false,
  totalLatencyMs = 170,
  tokensSaved = 2330,
  onOpenRadar,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [unfoldedNodeIds, setUnfoldedNodeIds] = useState<Record<string, boolean>>({
    "agent-sentinel": true,
    "agent-distiller": true,
  });

  // Build dynamic pipeline steps incorporating real agent telemetry & logs
  const pipelineSteps = [
    {
      id: "node-ingest",
      agentId: "node-ingest",
      title: "0. MCP Ingest Hub",
      role: "Raw Tool Output Buffer",
      icon: Terminal,
      actionDesc: "Captures raw stdio/HTTP tool JSON-RPC stream from upstream MCP server.",
      badge: "Inbound Stream",
      badgeType: "neutral" as const,
      data: undefined,
      unfoldedDetails: {
        input: "Raw unredacted stdio buffer from MCP tool execution",
        transformation: "Buffering & framing into deterministic JSON-RPC chunk",
        output: "Raw payload buffer ready for zero-trust proxy ingestion",
      },
    },
    {
      id: "agent-sentinel",
      agentId: "agent-sentinel",
      title: "1. Zero-Trust Sentinel",
      role: "Security & Credential Shield",
      icon: ShieldCheck,
      actionDesc:
        agents.find((a) => a.agentId === "agent-sentinel")?.contribution ||
        "Intercepts raw MCP stdout, redacts bearer tokens, secrets & passes sanitized buffer.",
      badge: "Zero-Trust Active",
      badgeType: "shield" as const,
      data: agents.find((a) => a.agentId === "agent-sentinel"),
      unfoldedDetails: {
        input:
          agents.find((a) => a.agentId === "agent-sentinel")?.inputSummary ||
          "Raw MCP tool response with Authorization: Bearer sk-live-982...",
        transformation: "Deterministic AST secret scrubbing & auth header masking",
        output:
          agents.find((a) => a.agentId === "agent-sentinel")?.outputSummary ||
          "Sanitized JSON-RPC buffer (0 secrets leaked)",
      },
    },
    {
      id: "agent-distiller",
      agentId: "agent-distiller",
      title: "2. AST & Token Distiller",
      role: "Semantic Compressor",
      icon: FileCode,
      actionDesc:
        agents.find((a) => a.agentId === "agent-distiller")?.contribution ||
        "Prunes null boilerplate and lockfile diffs, achieving ~70% token compression.",
      badge: agents.find((a) => a.agentId === "agent-distiller")?.metrics
        ?.reductionPercent
        ? `-${agents.find((a) => a.agentId === "agent-distiller")?.metrics?.reductionPercent}% Tokens`
        : "-70% Tokens",
      badgeType: "compression" as const,
      data: agents.find((a) => a.agentId === "agent-distiller"),
      unfoldedDetails: {
        input:
          agents.find((a) => a.agentId === "agent-distiller")?.inputSummary ||
          "Verbose schema & raw response packet",
        transformation: "Structural JSON pruning, null stripping, whitespace compaction",
        output:
          agents.find((a) => a.agentId === "agent-distiller")?.outputSummary ||
          "High-density semantic context payload",
      },
    },
    {
      id: "agent-specialist",
      agentId: "agent-specialist",
      title: "3. Domain Specialist",
      role: "Context Enricher",
      icon: Sparkles,
      actionDesc:
        agents.find((a) => a.agentId === "agent-specialist")?.contribution ||
        "Pre-computes relational topology, blast radius, and schema cross-references.",
      badge: "Deep Context",
      badgeType: "enrich" as const,
      data: agents.find((a) => a.agentId === "agent-specialist"),
      unfoldedDetails: {
        input:
          agents.find((a) => a.agentId === "agent-specialist")?.inputSummary ||
          "Normalized tool entity identifier",
        transformation: "Graph cross-reference, entity dependency resolution, schema linking",
        output:
          agents.find((a) => a.agentId === "agent-specialist")?.outputSummary ||
          "Relational context packet with safety constraints",
      },
    },
    {
      id: "agent-scout",
      agentId: "agent-scout",
      title: "4. Ecosystem Scout",
      role: "Trending Radar",
      icon: Compass,
      actionDesc:
        agents.find((a) => a.agentId === "agent-scout")?.contribution ||
        "Cross-checks global MCP registry for complementary tools & 1-click optimizations.",
      badge: "Global Radar",
      badgeType: "radar" as const,
      data: agents.find((a) => a.agentId === "agent-scout"),
      unfoldedDetails: {
        input:
          agents.find((a) => a.agentId === "agent-scout")?.inputSummary ||
          "Active MCP server profile & tool signature",
        transformation: "Autonomous query against 120+ MCP repository index",
        output:
          agents.find((a) => a.agentId === "agent-scout")?.outputSummary ||
          "Suggested upstream decorators & complementary tools",
      },
    },
    {
      id: "agent-critic",
      agentId: "agent-critic",
      title: "5. Verification Critic",
      role: "Protocol Attestor",
      icon: CheckCircle2,
      actionDesc:
        agents.find((a) => a.agentId === "agent-critic")?.contribution ||
        "Validates JSON-RPC schema conformity and attaches cryptographic provenance hash.",
      badge: "HMAC-SHA256",
      badgeType: "critic" as const,
      data: agents.find((a) => a.agentId === "agent-critic"),
      unfoldedDetails: {
        input:
          agents.find((a) => a.agentId === "agent-critic")?.inputSummary ||
          "Aggregated multi-agent context packet",
        transformation: "Cryptographic HMAC-SHA256 hash calculation & schema invariant checks",
        output:
          agents.find((a) => a.agentId === "agent-critic")?.outputSummary ||
          "Attested, tamper-proof payload buffer",
      },
    },
    {
      id: "agent-lead",
      agentId: "agent-lead",
      title: "6. Lead Reasoner",
      role: "Gemini 3.7 Flash Consensus",
      icon: Bot,
      actionDesc: "Synthesizes ultra-fast, zero-hallucination verdict from enriched swarm streams.",
      badge: "Consensus Reached",
      badgeType: "consensus" as const,
      data: undefined,
      unfoldedDetails: {
        input: "Attested & compressed multi-agent consensus stream",
        transformation: "Gemini 3.7 Flash thinking & final unified reasoning synthesis",
        output: "Instant, actionable, verifiable execution verdict",
      },
    },
  ];

  // Auto-play stepper through nodes
  useEffect(() => {
    if (!isAutoPlaying) return;
    const intervalMs = isRunning ? 600 : 3000;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % pipelineSteps.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isRunning, pipelineSteps.length]);

  const toggleUnfoldNode = (nodeId: string) => {
    setUnfoldedNodeIds((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleSelectNode = (idx: number, agentId: string) => {
    setActiveStepIndex(idx);
    if (agentId !== "node-ingest") {
      onSelectAgent(agentId);
    }
    setIsAutoPlaying(false);
  };

  const handlePrevStep = () => {
    setIsAutoPlaying(false);
    setActiveStepIndex((prev) => (prev === 0 ? pipelineSteps.length - 1 : prev - 1));
  };

  const handleNextStep = () => {
    setIsAutoPlaying(false);
    setActiveStepIndex((prev) => (prev + 1) % pipelineSteps.length);
  };

  const currentStep = pipelineSteps[activeStepIndex];

  return (
    <div className="space-y-4 font-sans">
      {/* Visual Pipeline Header Bar & Format Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`w-2.5 h-2.5 rounded-full ${isAutoPlaying ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"} shrink-0`} />
          <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center space-x-1.5">
            <Workflow className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            <span>Multi-Agent Unfolding Node Pipeline</span>
          </span>
          <span className="hidden md:inline-block px-2.5 py-0.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold whitespace-nowrap shrink-0">
            Stage {activeStepIndex + 1} of {pipelineSteps.length}
          </span>
        </div>

        {/* Playback Controls & Expand All */}
        <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
          <button
            type="button"
            onClick={() => {
              const allExpanded = Object.keys(unfoldedNodeIds).length === pipelineSteps.length;
              if (allExpanded) {
                setUnfoldedNodeIds({});
              } else {
                const all: Record<string, boolean> = {};
                pipelineSteps.forEach((s) => (all[s.id] = true));
                setUnfoldedNodeIds(all);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-medium transition-colors cursor-pointer"
          >
            {Object.keys(unfoldedNodeIds).length > 2 ? "Collapse Layers" : "Unfold All Nodes"}
          </button>

          {/* Stepper Buttons (Prev / Play-Pause / Next) */}
          <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevStep}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Previous Agent Step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isAutoPlaying
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              }`}
              title={isAutoPlaying ? "Pause Live Swarm Auto-play" : "Resume Live Swarm Auto-play"}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3 shrink-0" /> : <Play className="w-3 h-3 fill-current shrink-0" />}
              <span>{isAutoPlaying ? "Live Flowing" : "Paused"}</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Next Agent Step"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE UNFOLDING NODE DIAGRAM CANVAS */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#71717a 1px, transparent 1px), radial-gradient(#71717a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        {/* Top Horizontal Node Pipeline Previewer */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStepIndex === idx;
            const isUnfolded = Boolean(unfoldedNodeIds[step.id]);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleSelectNode(idx, step.agentId)}
                className={`p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                  isCurrent
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 scale-[1.02]"
                    : "bg-zinc-50/80 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-current/10 w-full">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isCurrent
                        ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-950"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold opacity-80">
                    {idx === 0 ? "RAW" : idx === 6 ? "LEAD" : `AG-0${idx}`}
                  </span>
                </div>

                <div className="space-y-0.5 min-w-0 w-full">
                  <div className="text-[11px] font-bold truncate">{step.title.replace(/^\d+\.\s*/, "")}</div>
                  <div className="text-[9px] font-mono opacity-70 truncate">{step.badge}</div>
                </div>

                {isCurrent && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
                )}
              </button>
            );
          })}
        </div>

        {/* CASCADE OF UNFOLDING NODES WITH CONNECTORS */}
        <div className="relative z-10 pt-5 space-y-4">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStepIndex === idx;
            const isUnfolded = Boolean(unfoldedNodeIds[step.id]);
            const agentData = step.data;

            return (
              <div key={step.id} className="relative">
                {/* Node Container Card */}
                <motion.div
                  layout
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isCurrent
                      ? "border-zinc-900 dark:border-white ring-2 ring-zinc-900/10 dark:ring-white/10 shadow-lg bg-zinc-50/90 dark:bg-zinc-900/90"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {/* Node Header Row */}
                  <div
                    onClick={() => {
                      toggleUnfoldNode(step.id);
                      handleSelectNode(idx, step.agentId);
                    }}
                    className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-colors gap-2"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Node Icon Box */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                          isCurrent
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-white scale-105"
                            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {step.title}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {step.role}
                          </span>
                          {step.badge && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                              {step.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-0.5 font-sans">
                          {agentData?.contribution || step.actionDesc}
                        </p>
                      </div>
                    </div>

                    {/* Unfold Action Toggle Pill */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {agentData?.durationMs && (
                        <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500">
                          ~{agentData.durationMs}ms
                        </span>
                      )}
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-semibold flex items-center space-x-1 shadow-2xs hover:bg-zinc-50"
                      >
                        <span>{isUnfolded ? "Fold Node" : "Unfold Node"}</span>
                        <span className="text-[10px]">{isUnfolded ? "▲" : "▼"}</span>
                      </button>
                    </div>
                  </div>

                  {/* UNFOLDED NODE BODY: Inbound Stream ➔ AST Transform ➔ Outbound Emits */}
                  <AnimatePresence>
                    {isUnfolded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 bg-white dark:bg-zinc-950 space-y-4"
                      >
                        {/* 3-Way Inbound / Transformation / Outbound Visual Data Flow */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                          {/* 1. Inbound */}
                          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                              <span>Inbound Packet</span>
                              <span className="text-zinc-400">Step In</span>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 font-sans text-xs leading-relaxed">
                              {agentData?.inputSummary || step.unfoldedDetails.input}
                            </p>
                          </div>

                          {/* 2. Transformation */}
                          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-500 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                              <span>AST & Logic Pipeline</span>
                              <span className="text-indigo-400">In-Flight</span>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 font-sans text-xs leading-relaxed">
                              {step.unfoldedDetails.transformation}
                            </p>
                          </div>

                          {/* 3. Outbound */}
                          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                              <span>Outbound Handoff</span>
                              <span className="text-emerald-400">Step Out</span>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 font-sans text-xs leading-relaxed">
                              {agentData?.outputSummary || step.unfoldedDetails.output}
                            </p>
                          </div>
                        </div>

                        {/* Findings / Verification Verdicts */}
                        {agentData?.findings && agentData.findings.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                              Node Assertions & Findings
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {agentData.findings.map((f, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 flex items-start space-x-2 shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed font-sans">{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Real Emitted Logs Stream */}
                        {agentData?.emittedLogs && agentData.emittedLogs.length > 0 && (
                          <div className="rounded-xl bg-zinc-950 p-3.5 border border-zinc-800 text-[11px] font-mono space-y-1.5 overflow-x-auto shadow-inner">
                            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center justify-between pb-1 border-b border-zinc-800">
                              <span>Emitted Agent Execution Logs</span>
                              <span className="text-emerald-400 font-mono">Live Telemetry</span>
                            </div>
                            {agentData.emittedLogs.map((log, lIdx) => (
                              <div key={lIdx} className="text-zinc-300 flex items-start space-x-2">
                                <span className="text-emerald-400 font-bold shrink-0">&gt;</span>
                                <span className="font-mono leading-relaxed">{log}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Radar quick trigger for Scout node */}
                        {step.id === "agent-scout" && onOpenRadar && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={onOpenRadar}
                              className="py-2.5 px-4 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer font-mono"
                            >
                              <Compass className="w-4 h-4" />
                              <span>Explore Matched MCPs on Trending Radar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Animated Flow Connector Pipe Between Nodes */}
                {idx < pipelineSteps.length - 1 && (
                  <div className="flex justify-center my-1 relative z-20 pointer-events-none">
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 shadow-2xs text-[10px] font-mono">
                      <ArrowDown className="w-3 h-3 animate-bounce" />
                      <span>Handoff to {pipelineSteps[idx + 1].title.replace(/^\d+\.\s*/, "")}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
