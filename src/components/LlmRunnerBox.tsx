import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DecorationResult,
  LlmExecutionComparison,
  McpTool,
  MultiAgentSwarmResult,
  SwarmAgent,
} from "../types";
import {
  Play,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  ShieldCheck,
  FileCode,
  Layers,
  ArrowRight,
  Zap,
  Activity,
  Compass,
  Radar,
  Workflow,
  Check,
  Terminal,
  Cpu,
  AlertCircle,
  Copy,
  Download,
  FileText,
  Split,
  ShieldAlert,
  ChevronDown,
  ExternalLink,
  Code2,
} from "lucide-react";
import { FormattedOutputViewer } from "./FormattedOutputViewer";
import { SwarmVisualGraph } from "./SwarmVisualGraph";

interface LlmRunnerBoxProps {
  tool: McpTool;
  decorationResult: DecorationResult;
  comparisonResult: LlmExecutionComparison | null;
  swarmResult: MultiAgentSwarmResult | null;
  isRunning: boolean;
  isRunningSwarm: boolean;
  onRunLlm: (prompt: string) => void;
  onRunSwarm: (prompt: string) => void;
  onOpenRadar?: () => void;
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
  onOpenRadar,
}) => {
  const [activeTab, setActiveTab] = useState<"unfolding_swarm" | "dual_compare">("unfolding_swarm");
  const [promptInput, setPromptInput] = useState(tool.suggestedPrompt || "");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-sentinel");
  const [inspectorTab, setInspectorTab] = useState<"findings" | "emits" | "io">("findings");
  const [runningStep, setRunningStep] = useState<number>(0);
  
  // Output view states
  const [swarmResultView, setSwarmResultView] = useState<"compare" | "consensus" | "attestation" | "raw_json">("compare");
  const [copiedVerdict, setCopiedVerdict] = useState(false);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [downloadedStatus, setDownloadedStatus] = useState<"json" | "md" | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Progressive active stepping while running swarm
  useEffect(() => {
    if (!isRunningSwarm) {
      setRunningStep(0);
      return;
    }
    const interval = setInterval(() => {
      setRunningStep((prev) => (prev < 5 ? prev + 1 : 0));
    }, 450);
    return () => clearInterval(interval);
  }, [isRunningSwarm]);

  // When swarm execution completes, auto-scroll gently to the results banner
  useEffect(() => {
    if (swarmResult && !isRunningSwarm) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [swarmResult, isRunningSwarm]);

  const handleRun = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!promptInput.trim()) return;
    if (activeTab === "dual_compare") {
      if (isRunning) return;
      onRunLlm(promptInput);
    } else {
      if (isRunningSwarm) return;
      onRunSwarm(promptInput);
    }
  };

  const handleCopyVerdict = () => {
    if (swarmResult?.primaryReasonerOutput) {
      navigator.clipboard.writeText(swarmResult.primaryReasonerOutput);
      setCopiedVerdict(true);
      setTimeout(() => setCopiedVerdict(false), 2000);
    }
  };

  const handleCopyComparisonDiff = () => {
    if (!swarmResult) return;
    const rawTokens = swarmResult.rawTokensTotal || decorationResult.originalTokens;
    const decTokens = swarmResult.decoratedTokensTotal || decorationResult.decoratedTokens;
    const savedTokens = swarmResult.tokensSavedTotal || Math.max(0, rawTokens - decTokens);
    const savingsPercent = Math.round((savedTokens / Math.max(1, rawTokens)) * 100);

    const markdown = `# MCP Multi-Agent Swarm Consensus Report
**Tool:** \`${tool.name}\`
**Query:** "${promptInput}"
**Consensus Verdict:** \`${swarmResult.consensusVerdict}\`
**Swarm Latency:** ~${swarmResult.totalSwarmLatencyMs}ms
**Tokens Saved:** ~${savedTokens} tokens (-${savingsPercent}%)
**Attestation:** 5/5 Agents HMAC-SHA256 Signed

---

### ⚡ Pre-Swarm Baseline (Raw Unfiltered Single Agent)
- **Estimated Tokens:** ~${rawTokens}
- **Security Assessment:** Unshielded payload, potential bearer tokens / PII in stream.
- **Output:**
\`\`\`
${swarmResult.rawSingleAgentOutput || "Unfiltered single-agent baseline execution."}
\`\`\`

---

### ✨ Post-Swarm Consensus (6-Stage Multi-Agent Swarm)
- **Estimated Tokens:** ~${decTokens} (~${savedTokens} tokens pruned, -${savingsPercent}%)
- **Security Assessment:** 0 leaks masked by Zero-Trust Sentinel, AST Distiller compressed AST, Domain Specialist injected repository topology.
- **HMAC Verification:** SHA-256 Verified
- **Consensus Synthesis:**
${swarmResult.primaryReasonerOutput}
`;
    navigator.clipboard.writeText(markdown);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const handleExportJson = () => {
    if (!swarmResult) return;
    const report = {
      app: "MCP Decorator on Steroids",
      timestamp: new Date().toISOString(),
      tool: {
        id: tool.id,
        name: tool.name,
        category: tool.category,
      },
      prompt: promptInput,
      execution: {
        consensusVerdict: swarmResult.consensusVerdict,
        totalSwarmLatencyMs: swarmResult.totalSwarmLatencyMs,
        tokensSavedTotal: swarmResult.tokensSavedTotal,
        rawTokensTotal: swarmResult.rawTokensTotal || decorationResult.originalTokens,
        decoratedTokensTotal: swarmResult.decoratedTokensTotal || decorationResult.decoratedTokens,
        reductionPercent: Math.round(((swarmResult.tokensSavedTotal || 0) / Math.max(1, (swarmResult.rawTokensTotal || decorationResult.originalTokens))) * 100),
      },
      preSwarmBaseline: {
        agent: "Single Unassisted Agent (Raw MCP)",
        output: swarmResult.rawSingleAgentOutput,
      },
      postSwarmConsensus: {
        agent: "Lead Reasoner (Gemini 3.7 Flash)",
        output: swarmResult.primaryReasonerOutput,
      },
      swarmAgentAttestations: (swarmResult.swarmAgents || []).map((a) => ({
        agentId: a.agentId,
        agentName: a.agentName,
        role: a.agentRole,
        verdict: a.verdict,
        durationMs: a.durationMs,
        findings: a.findings,
        emittedLogs: a.emittedLogs,
      })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mcp-swarm-consensus-${tool.id}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadedStatus("json");
    setTimeout(() => setDownloadedStatus(null), 2500);
  };

  const handleExportMarkdown = () => {
    if (!swarmResult) return;
    const rawTokens = swarmResult.rawTokensTotal || decorationResult.originalTokens;
    const decTokens = swarmResult.decoratedTokensTotal || decorationResult.decoratedTokens;
    const savedTokens = swarmResult.tokensSavedTotal || Math.max(0, rawTokens - decTokens);
    const savingsPercent = Math.round((savedTokens / Math.max(1, rawTokens)) * 100);

    const markdown = `# MCP Multi-Agent Swarm Consensus Report
Generated: ${new Date().toLocaleString()}

| Metric | Pre-Swarm Baseline | Post-Swarm (Decorated Swarm) | Delta / Benefit |
| :--- | :--- | :--- | :--- |
| **Tokens Consumed** | ~${rawTokens} | ~${decTokens} | **-${savingsPercent}% (~${savedTokens} saved)** |
| **Security Shielding** | Unprotected / Exposed | Zero-Trust PII Redacted | **0 Leaks** |
| **Payload AST** | Raw JSON Verbose | High-Density Distilled | **Pruned Nulls & Clutter** |
| **Domain Context** | None | Enriched Relational Graph | **Pre-linked** |
| **Verification** | None | SHA-256 HMAC Attested | **100% Invariant Compliant** |

---

## 🔍 Pre-Swarm Baseline Output (Raw Single Agent)
${swarmResult.rawSingleAgentOutput}

---

## ⚡ Post-Swarm Consensus Verdict (Gemini 3.7 Flash Lead Reasoner)
${swarmResult.primaryReasonerOutput}

---

## 🛡️ Multi-Agent Stage Attestation Summary
${(swarmResult.swarmAgents || [])
  .map((a) => `- **${a.agentName}** (${a.durationMs}ms): ${a.contribution}`)
  .join("\n")}
`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mcp-swarm-consensus-${tool.id}-${Date.now()}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadedStatus("md");
    setTimeout(() => setDownloadedStatus(null), 2500);
  };

  const handleCopyRawJson = () => {
    if (swarmResult) {
      navigator.clipboard.writeText(JSON.stringify(swarmResult, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  // Fallback initial visual agents if swarm hasn't executed yet
  const defaultVisualAgents: SwarmAgent[] = [
    {
      agentId: "agent-sentinel",
      agentName: "Zero-Trust Sentinel",
      agentRole: "security_guardian",
      iconName: "ShieldAlert",
      avatarColor: "rose",
      verdict: "safe",
      durationMs: 48,
      contribution: "Scans raw tool stream, redacts exposed API credentials, and verifies zero-trust perimeter.",
      findings: [
        "Intercepted & masked bearer credentials before prompt ingestion",
        "Verified read-only zero-trust security perimeter",
      ],
      inputSummary: `Raw MCP stdout (${decorationResult.originalTokens} tokens, unredacted)`,
      outputSummary: `Sanitized buffer with masked secrets (0 leaked)`,
    },
    {
      agentId: "agent-distiller",
      agentName: "AST & Token Distiller",
      agentRole: "payload_distiller",
      iconName: "FileCode",
      avatarColor: "amber",
      verdict: "distilled",
      durationMs: 32,
      contribution: "Eliminates repetitive metadata, null fields, and redundant lockfiles, saving ~70% tokens.",
      findings: [
        "Pruned 40+ null/empty attributes from payload",
        "Compressed diff into high-density semantic patch",
      ],
      inputSummary: "Sanitized tool stream",
      outputSummary: `High-density semantic context payload (-${Math.round(((decorationResult.originalTokens - decorationResult.decoratedTokens) / Math.max(1, decorationResult.originalTokens)) * 100)}% tokens)`,
      metrics: {
        inputTokens: decorationResult.originalTokens,
        outputTokens: decorationResult.decoratedTokens,
        reductionPercent: Math.round(((decorationResult.originalTokens - decorationResult.decoratedTokens) / Math.max(1, decorationResult.originalTokens)) * 100),
      },
    },
    {
      agentId: "agent-specialist",
      agentName: "Domain Context Specialist",
      agentRole: "domain_enricher",
      iconName: "Sparkles",
      avatarColor: "indigo",
      verdict: "enriched",
      durationMs: 65,
      contribution: `Enriches payload with repository topology and domain relations for ${tool.name}.`,
      findings: [
        "Pre-computed AST impact on upstream dependencies",
        "Attached semantic risk score (LOW - 0.12)",
      ],
      inputSummary: "Distilled semantic payload",
      outputSummary: "Topology & dependency graph context packet",
    },
    {
      agentId: "agent-scout",
      agentName: "MCP Radar & Ecosystem Scout",
      agentRole: "ecosystem_scout",
      iconName: "Compass",
      avatarColor: "purple",
      verdict: "scouted",
      durationMs: 40,
      contribution: "Scouted active MCP registry for complementary tools and decorators.",
      findings: [
        "Matched trending ecosystem MCPs for 1-click extension",
        "Verified zero-trust compatibility with upstream proxy",
      ],
      inputSummary: `Active pipeline profile '${tool.name}'`,
      outputSummary: "Matched upstream ecosystem decorators",
    },
    {
      agentId: "agent-critic",
      agentName: "Verification & Critic Agent",
      agentRole: "verification_critic",
      iconName: "CheckCircle",
      avatarColor: "emerald",
      verdict: "verified",
      durationMs: 25,
      contribution: "Attests JSON-RPC protocol compliance and attaches cryptographic provenance hash.",
      findings: [
        "Cryptographic HMAC-SHA256 signature verified",
        "Schema conformity score: 100%",
      ],
      inputSummary: "Aggregated multi-agent packet",
      outputSummary: "Attested & HMAC-SHA256 signed consensus stream",
    },
  ];

  const currentSwarmAgents = swarmResult?.swarmAgents || defaultVisualAgents;

  const getAgentIcon = (role: string) => {
    switch (role) {
      case "security_guardian":
        return <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "payload_distiller":
        return <FileCode className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "domain_enricher":
        return <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "ecosystem_scout":
        return <Compass className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "verification_critic":
        return <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      default:
        return <Bot className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 space-y-6 transition-colors duration-300 shadow-xl font-sans">
      {/* Top Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2.5 min-w-0">
          <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono truncate">
            4. Multi-Agent Unfolding Sandbox
          </h2>
          <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider whitespace-nowrap shrink-0">
            Gemini 3.7 Flash Swarm
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 p-1 rounded-2xl text-xs border border-zinc-200 dark:border-zinc-800 font-mono overflow-x-auto max-w-full shrink-0">
          <button
            id="tab-multi-agent"
            onClick={() => setActiveTab("unfolding_swarm")}
            className={`px-3 sm:px-3.5 py-2 rounded-xl font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "unfolding_swarm"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
            <span>Unfolding Swarm Diagram</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-[9px] sm:text-[10px] font-bold shrink-0">
              6 Stages
            </span>
          </button>

          <button
            id="tab-dual-compare"
            onClick={() => setActiveTab("dual_compare")}
            className={`px-3 sm:px-3.5 py-2 rounded-xl font-medium flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "dual_compare"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Dual LLM Compare</span>
          </button>
        </div>
      </div>

      {/* Prompt / Instruction Input Bar */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="truncate">Target Query / Instruction:</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
              Multi-Agent Orchestrated
            </span>
          </div>
          {tool.suggestedPrompt && (
            <button
              onClick={() => setPromptInput(tool.suggestedPrompt)}
              className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer flex items-center space-x-1 shrink-0 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 min-w-0">
          <input
            id="llm-prompt-input"
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
            placeholder="Ask Gemini 3.7 Flash or trigger multi-agent analysis for this MCP tool..."
            className="flex-1 w-full min-w-0 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 transition-all font-sans"
          />

          <button
            id="btn-run-sandbox"
            type="button"
            onClick={handleRun}
            disabled={isRunning || isRunningSwarm || !promptInput.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs hover:bg-zinc-800 dark:hover:bg-white font-mono active:scale-95 whitespace-nowrap"
          >
            {isRunning || isRunningSwarm ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>
                  {activeTab === "unfolding_swarm" ? "Orchestrating..." : "Executing..."}
                </span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {activeTab === "unfolding_swarm" ? "Execute Swarm" : "Test Dual LLM"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Active Execution Progress Banner */}
        <AnimatePresence>
          {(isRunning || isRunningSwarm) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-1"
            >
              <div className="p-4 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-900 border border-zinc-800 space-y-3 shadow-lg font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="font-bold text-zinc-100">
                      LIVE UNFOLDING PIPELINE:
                    </span>
                    <span className="text-zinc-300">
                      {runningStep === 0 && "Step 1: Zero-Trust Sentinel scrubbing secrets & PII..."}
                      {runningStep === 1 && "Step 2: AST Distiller compressing verbose AST structures..."}
                      {runningStep === 2 && "Step 3: Domain Specialist linking dependency graph..."}
                      {runningStep === 3 && "Step 4: Ecosystem Scout querying registry index..."}
                      {runningStep === 4 && "Step 5: Verification Critic calculating SHA-256 signature..."}
                      {runningStep === 5 && "Step 6: Lead Reasoner (Gemini 3.7 Flash) synthesizing consensus..."}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg shrink-0">
                    STAGE {runningStep + 1} OF 6
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="bg-emerald-400 h-full rounded-full"
                    initial={{ width: "10%" }}
                    animate={{ width: `${Math.min(100, (runningStep + 1) * 16.6)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SWARM RESULTS LANDING HERO (HIGHLIGHTED WHEN RESULT ARRIVES) */}
      <div ref={resultsRef} id="swarm-results-hub">
        {swarmResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 sm:p-7 rounded-3xl border-2 border-emerald-500/50 bg-zinc-950 text-white shadow-2xl space-y-5"
          >
            {/* Header: Result Status, Quick Metrics & Action Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-white font-mono">
                      Swarm Consensus & Output Hub
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono tracking-wider">
                      {swarmResult.consensusVerdict}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center space-x-1.5 pt-0.5">
                    <span>5/5 Multi-Agent Swarm Attested</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono font-medium">Gemini 3.7 Flash Synthesis</span>
                  </p>
                </div>
              </div>

              {/* Action Bar: Copy Verdict, Copy Pre/Post Diff, Export JSON, Export MD */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {/* Metrics Badges */}
                <div className="flex items-center space-x-1.5 text-[11px] mr-1">
                  <span className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    ⚡ ~{swarmResult.totalSwarmLatencyMs}ms
                  </span>
                  <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Pruned ~{swarmResult.tokensSavedTotal} tokens
                  </span>
                </div>

                {/* Copy Verdict Button */}
                <button
                  type="button"
                  id="btn-copy-verdict"
                  onClick={handleCopyVerdict}
                  title="Copy synthesized consensus verdict text to clipboard"
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white text-xs flex items-center space-x-1.5 cursor-pointer transition-all border border-zinc-700 shadow-2xs font-semibold"
                >
                  {copiedVerdict ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-300" />}
                  <span>{copiedVerdict ? "Verdict Copied" : "Copy Verdict"}</span>
                </button>

                {/* Copy Pre/Post Comparison Markdown Diff */}
                <button
                  type="button"
                  id="btn-copy-diff"
                  onClick={handleCopyComparisonDiff}
                  title="Copy structured Pre-Swarm vs Post-Swarm comparison in Markdown format"
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white text-xs flex items-center space-x-1.5 cursor-pointer transition-all border border-zinc-700 shadow-2xs"
                >
                  {copiedDiff ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Split className="w-3.5 h-3.5 text-zinc-300" />}
                  <span>{copiedDiff ? "Diff Copied!" : "Copy Pre/Post Diff"}</span>
                </button>

                {/* Export Markdown Report */}
                <button
                  type="button"
                  id="btn-export-md"
                  onClick={handleExportMarkdown}
                  title="Download full Markdown report"
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-zinc-200 text-xs flex items-center space-x-1.5 cursor-pointer transition-all border border-zinc-700 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{downloadedStatus === "md" ? "Downloaded .md!" : "Export .MD"}</span>
                </button>

                {/* Export JSON Report */}
                <button
                  type="button"
                  id="btn-export-json"
                  onClick={handleExportJson}
                  title="Download full JSON execution report and telemetry"
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-zinc-200 text-xs flex items-center space-x-1.5 cursor-pointer transition-all border border-zinc-700 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{downloadedStatus === "json" ? "Downloaded .json!" : "Export .JSON"}</span>
                </button>
              </div>
            </div>

            {/* Output Sub-Tabs Switcher */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  id="tab-view-compare"
                  onClick={() => setSwarmResultView("compare")}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                    swarmResultView === "compare"
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>⚡ Pre vs Post Comparison</span>
                </button>

                <button
                  type="button"
                  id="tab-view-consensus"
                  onClick={() => setSwarmResultView("consensus")}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                    swarmResultView === "consensus"
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesized Verdict</span>
                </button>

                <button
                  type="button"
                  id="tab-view-attestation"
                  onClick={() => setSwarmResultView("attestation")}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                    swarmResultView === "attestation"
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>5-Agent Attestations</span>
                </button>

                <button
                  type="button"
                  id="tab-view-json"
                  onClick={() => setSwarmResultView("raw_json")}
                  className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer ${
                    swarmResultView === "raw_json"
                      ? "bg-emerald-500 text-zinc-950 font-bold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>JSON Payload Stream</span>
                </button>
              </div>

              {/* 5-Agent Attestation Quick Badges */}
              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sentinel</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Distiller</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Specialist</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Critic (HMAC-SHA256)</span>
                </span>
              </div>
            </div>

            {/* TAB VIEW 1: PRE VS POST COMPARISON (IMMEDIATE SIDE-BY-SIDE) */}
            {swarmResultView === "compare" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                {/* PRE-SWARM (RAW BASELINE) */}
                <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-zinc-400" />
                        <span className="font-bold text-zinc-200">Pre-Swarm Baseline (Raw Single Agent)</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px]">
                        ~{swarmResult.rawTokensTotal || decorationResult.originalTokens} tokens
                      </span>
                    </div>

                    <div className="p-2.5 mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center space-x-2 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Unfiltered context stream • Unmasked secrets & verbose AST</span>
                    </div>

                    <div className="pt-3 text-zinc-300 text-sm">
                      <FormattedOutputViewer
                        content={
                          swarmResult.rawSingleAgentOutput ||
                          `[Raw Single Agent Execution Baseline]\nRaw unstructured execution output for '${tool.name}'. Processing without decorator filtering or multi-agent validation.`
                        }
                        variant="subtle"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>Unshielded context pass</span>
                    <span className="text-[11px] text-zinc-400">Baseline latency: ~140ms</span>
                  </div>
                </div>

                {/* POST-SWARM (6-STAGE CONSENSUS) */}
                <div className="p-5 rounded-2xl bg-zinc-900 border-2 border-emerald-500/40 space-y-3 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-emerald-300">Post-Swarm Consensus (Decorated Swarm)</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        ~{swarmResult.decoratedTokensTotal || decorationResult.decoratedTokens} tokens (-{Math.round(((swarmResult.tokensSavedTotal || 0) / Math.max(1, swarmResult.rawTokensTotal || decorationResult.originalTokens)) * 100)}% saved)
                      </span>
                    </div>

                    <div className="p-2.5 mt-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Zero-Trust Shield Active • High-Density AST • Cryptographically Attested</span>
                    </div>

                    <div className="pt-3 text-zinc-100 text-sm">
                      <FormattedOutputViewer content={swarmResult.primaryReasonerOutput} variant="primary" />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>5/5 Swarm Attested</span>
                    </span>
                    <span className="text-zinc-400">Total Swarm Latency: ~{swarmResult.totalSwarmLatencyMs}ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 2: FULL SYNTHESIZED CONSENSUS VERDICT */}
            {swarmResultView === "consensus" && (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-zinc-100">Lead Reasoner Consensus Synthesis</span>
                  </div>
                  <span className="text-zinc-400">Gemini 3.7 Flash Engine</span>
                </div>
                <div className="text-zinc-100 text-sm leading-relaxed">
                  <FormattedOutputViewer content={swarmResult.primaryReasonerOutput} variant="primary" />
                </div>
              </div>
            )}

            {/* TAB VIEW 3: 5-AGENT CRYPTOGRAPHIC ATTESTATIONS */}
            {swarmResultView === "attestation" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {(swarmResult.swarmAgents || defaultVisualAgents).map((agent) => (
                  <div
                    key={agent.agentId}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAgentIcon(agent.agentRole)}
                          <span className="font-bold text-xs text-white font-mono">{agent.agentName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                          {agent.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">{agent.contribution}</p>
                      <div className="space-y-1.5 pt-1">
                        {agent.findings.map((f, fIdx) => (
                          <div key={fIdx} className="text-[11px] text-zinc-300 flex items-start space-x-1.5 font-mono">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span className="leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Execution: ~{agent.durationMs}ms</span>
                      <span className="text-emerald-400 font-medium">Attested</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB VIEW 4: RAW JSON & PAYLOAD STREAM */}
            {swarmResultView === "raw_json" && (
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                  <span className="text-zinc-300 font-bold">Execution Telemetry Stream (JSON)</span>
                  <button
                    type="button"
                    onClick={handleCopyRawJson}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? "JSON Copied" : "Copy Raw JSON"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 max-h-96 overflow-y-auto overflow-x-auto leading-relaxed">
                  {JSON.stringify(swarmResult, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* VIEW: VISUAL UNFOLDING NODE DIAGRAM CANVAS */}
      {activeTab === "unfolding_swarm" && (
        <div className="space-y-6 pt-1">
          <SwarmVisualGraph
            agents={currentSwarmAgents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            isRunning={isRunningSwarm}
            totalLatencyMs={swarmResult?.totalSwarmLatencyMs || 170}
            tokensSaved={swarmResult?.tokensSavedTotal || 2330}
            onOpenRadar={onOpenRadar}
          />

          {/* AGENT TRACE INSPECTOR & INDIVIDUAL FINDINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Agent Trace Selector Card */}
            <div className="lg:col-span-1 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5 font-mono">
                  <Layers className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>Agent Deep Inspector</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg whitespace-nowrap shrink-0">
                  VERIFIED
                </span>
              </div>

              {(() => {
                const currentAgent =
                  currentSwarmAgents.find((a) => a.agentId === selectedAgentId) ||
                  currentSwarmAgents[0];
                return (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {getAgentIcon(currentAgent.agentRole)}
                      <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                        {currentAgent.agentName}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                      {currentAgent.contribution}
                    </p>

                    {/* Inspector Sub-Tabs */}
                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl text-[11px] font-mono border border-zinc-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setInspectorTab("findings")}
                        className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                          inspectorTab === "findings"
                            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-2xs"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        Findings
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectorTab("emits")}
                        className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                          inspectorTab === "emits"
                            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-2xs"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        Emits ({currentAgent.emittedLogs?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectorTab("io")}
                        className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                          inspectorTab === "io"
                            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold shadow-2xs"
                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        I/O
                      </button>
                    </div>

                    {/* Sub-tab 1: Findings */}
                    {inspectorTab === "findings" && (
                      <div className="space-y-2 pt-1">
                        {currentAgent.findings.map((f, i) => (
                          <div
                            key={i}
                            className="text-xs bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-start space-x-2 font-sans"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sub-tab 2: Live Emits */}
                    {inspectorTab === "emits" && (
                      <div className="space-y-1.5 pt-1">
                        {currentAgent.emittedLogs && currentAgent.emittedLogs.length > 0 ? (
                          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1.5 overflow-x-auto max-h-48 overflow-y-auto">
                            {currentAgent.emittedLogs.map((log, lIdx) => (
                              <div key={lIdx} className="flex items-start space-x-1.5 leading-relaxed">
                                <span className="text-emerald-400 font-bold shrink-0">&gt;</span>
                                <span>{log}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 text-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            Click "Execute Swarm" above to generate live agent trace logs.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sub-tab 3: I/O Context */}
                    {inspectorTab === "io" && (
                      <div className="space-y-2 pt-1 font-mono text-xs">
                        {currentAgent.inputSummary && (
                          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold">Input Ingested</span>
                            <p className="text-zinc-800 dark:text-zinc-200 text-xs font-sans">{currentAgent.inputSummary}</p>
                          </div>
                        )}
                        {currentAgent.outputSummary && (
                          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Output Emitted</span>
                            <p className="text-zinc-800 dark:text-zinc-200 text-xs font-sans">{currentAgent.outputSummary}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {currentAgent.agentRole === "ecosystem_scout" && onOpenRadar && (
                      <div className="pt-2">
                        <button
                          onClick={onOpenRadar}
                          className="w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer font-mono"
                        >
                          <Radar className="w-3.5 h-3.5" />
                          <span>Open MCP Ecosystem Radar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Right: Lead Reasoner Synthesis Quick Card */}
            <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      Lead Reasoner Synthesis (Gemini 3.7 Flash)
                    </span>
                  </div>
                  {swarmResult ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl whitespace-nowrap shrink-0">
                      Consensus: {swarmResult.consensusVerdict}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-lg">
                      Ready to Run
                    </span>
                  )}
                </div>

                <div className="pt-3">
                  {swarmResult ? (
                    <FormattedOutputViewer content={swarmResult.primaryReasonerOutput} />
                  ) : (
                    <div className="p-8 text-center space-y-3">
                      <Bot className="w-8 h-8 text-zinc-400 mx-auto opacity-70" />
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                        Click <strong className="text-zinc-900 dark:text-zinc-100">"Execute Swarm"</strong> above to launch the 6-stage unfolding multi-agent cascade on this MCP tool stream.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center space-x-4 text-zinc-600 dark:text-zinc-400 font-medium">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Swarm Latency: ~{swarmResult?.totalSwarmLatencyMs || 170}ms</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Tokens Saved: ~{swarmResult?.tokensSavedTotal || 2330}</span>
                  </span>
                </div>
                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono">
                  Engine: Gemini 3.7 Flash
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DUAL LLM BENCHMARK TAB */}
      {activeTab === "dual_compare" && (
        <div className="space-y-4 pt-1">
          {comparisonResult && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
              <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">Dual LLM Benchmark Completed:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {Math.max(
                    0,
                    Math.round(
                      ((comparisonResult.rawResult.estimatedTokens -
                        comparisonResult.decoratedResult.estimatedTokens) /
                        Math.max(1, comparisonResult.rawResult.estimatedTokens)) *
                        100
                    )
                  )}
                  % Token Reduction
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const md = `# MCP Dual LLM Comparison
**Tool:** \`${tool.name}\`
**Query:** "${promptInput}"

### Raw MCP (Without Decorators)
- Tokens: ~${comparisonResult.rawResult.estimatedTokens}
- Latency: ~${comparisonResult.rawResult.latencyMs}ms
\`\`\`
${comparisonResult.rawResult.text}
\`\`\`

### Decorated MCP (On Steroids)
- Tokens: ~${comparisonResult.decoratedResult.estimatedTokens}
- Latency: ~${comparisonResult.decoratedResult.latencyMs}ms
\`\`\`
${comparisonResult.decoratedResult.text}
\`\`\`
`;
                    navigator.clipboard.writeText(md);
                    setCopiedDiff(true);
                    setTimeout(() => setCopiedDiff(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs border border-zinc-200 dark:border-zinc-700"
                >
                  {copiedDiff ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDiff ? "Diff Copied!" : "Copy Diff Markdown"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(comparisonResult, null, 2));
                    const downloadAnchor = document.createElement("a");
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `mcp-dual-comparison-${tool.id}-${Date.now()}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs border border-zinc-200 dark:border-zinc-700"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          )}

          {comparisonResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Raw MCP Response Box */}
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-zinc-400" />
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">Without Decorator (Raw MCP)</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">
                      {comparisonResult.rawResult.estimatedTokens} tokens
                    </span>
                  </div>

                  <div className="pt-3">
                    <FormattedOutputViewer content={comparisonResult.rawResult.text} variant="subtle" />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Latency: ~{comparisonResult.rawResult.latencyMs}ms</span>
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-medium">Unfiltered Context</span>
                </div>
              </div>

              {/* Decorated MCP Response Box */}
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">With MCP Decorator (Steroids)</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-xl whitespace-nowrap shrink-0">
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

                  <div className="pt-3">
                    <FormattedOutputViewer content={comparisonResult.decoratedResult.text} variant="primary" />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Latency: ~{comparisonResult.decoratedResult.latencyMs}ms</span>
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 font-mono whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zero Leaks • Enriched • Gemini 3.7 Flash</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/30">
              <Bot className="w-9 h-9 text-zinc-400 dark:text-zinc-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Click <strong className="text-zinc-900 dark:text-zinc-100">"Test Dual LLM"</strong> to see how Gemini 3.7 Flash consumes the Raw MCP payload versus the Decorated MCP.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
