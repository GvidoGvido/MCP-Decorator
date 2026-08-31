import React, { useState } from "react";
import { DecorationResult, McpTool } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sparkles,
  Clock,
  FileCode,
  Copy,
  Check,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface InterceptionInspectorProps {
  tool: McpTool;
  result: DecorationResult;
}

export const InterceptionInspector: React.FC<InterceptionInspectorProps> = ({
  tool,
  result,
}) => {
  const [activeTab, setActiveTab] = useState<"payloads" | "redactions" | "enrichments" | "trace">("payloads");
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedDecorated, setCopiedDecorated] = useState(false);

  const rawJsonString = typeof result.originalPayload === "string"
    ? result.originalPayload
    : JSON.stringify(result.originalPayload, null, 2);

  const decoratedJsonString = typeof result.decoratedPayload === "string"
    ? result.decoratedPayload
    : JSON.stringify(result.decoratedPayload, null, 2);

  const handleCopy = (text: string, isRaw: boolean) => {
    navigator.clipboard.writeText(text);
    if (isRaw) {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedDecorated(true);
      setTimeout(() => setCopiedDecorated(false), 2000);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-7 space-y-5 transition-colors duration-300">
      {/* Top Banner with Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-mono">
            3. Interception Diff & Payload Transformer
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">{tool.name}</span>
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 whitespace-nowrap shrink-0 shadow-2xs">
              TRANSFORMED & VERIFIED
            </span>
          </div>
        </div>

        {/* Live Stat Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5 font-medium whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span className="font-bold font-mono">{result.tokenSavingsPercent}% Tokens Cut</span>
            <span className="text-zinc-500 text-[11px] font-mono">({result.originalTokens} → {result.decoratedTokens})</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5 font-medium whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
            <span className="font-mono">{result.redactions.length} Secrets Shielded</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5 font-medium whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-[11px]">{result.estimatedLatencyDecoratedMs}ms (was {result.estimatedLatencyOriginalMs}ms)</span>
          </div>
        </div>
      </div>

      {/* Security Warnings if any */}
      {result.securityWarnings.length > 0 && (
        <div className="space-y-2">
          {result.securityWarnings.map((warn, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-start space-x-3 text-xs"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-zinc-900 dark:text-zinc-100" />
              <div>
                <span className="font-bold font-mono block">{warn.title}</span>
                <span className="text-zinc-600 dark:text-zinc-400">{warn.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 text-xs pb-3.5 font-medium font-mono">
        <button
          onClick={() => setActiveTab("payloads")}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap shrink-0 ${
            activeTab === "payloads"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Payload Diff (Raw vs Steroids)</span>
        </button>

        <button
          onClick={() => setActiveTab("redactions")}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap shrink-0 ${
            activeTab === "redactions"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Audit ({result.redactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("enrichments")}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap shrink-0 ${
            activeTab === "enrichments"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Domain Context ({result.domainEnrichments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trace")}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap shrink-0 ${
            activeTab === "trace"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pipeline Trace ({result.pipelineSteps.length})</span>
        </button>
      </div>

      {/* Tab 1: Payloads Side-by-Side */}
      {activeTab === "payloads" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Raw MCP Payload */}
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden shadow-sm min-w-0">
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono gap-2">
              <div className="flex items-center space-x-2 min-w-0 truncate">
                <span className="text-zinc-300 font-semibold truncate">Raw Standard MCP</span>
                <span className="text-[10px] text-zinc-500 shrink-0 whitespace-nowrap">({result.originalTokens} tokens)</span>
              </div>
              <button
                onClick={() => handleCopy(rawJsonString, true)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center space-x-1.5 cursor-pointer transition-colors text-xs font-mono whitespace-nowrap shrink-0"
                title="Copy raw payload"
              >
                {copiedRaw ? <Check className="w-3.5 h-3.5 text-zinc-200" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedRaw ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[380px] font-mono text-[11px] text-zinc-400 leading-relaxed min-w-0">
              <pre className="overflow-x-auto">{rawJsonString}</pre>
            </div>
          </div>

          {/* Right: Decorated MCP on Steroids Payload */}
          <div className="bg-zinc-950 rounded-2xl border border-zinc-700 flex flex-col overflow-hidden shadow-sm min-w-0">
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono gap-2">
              <div className="flex items-center space-x-2 min-w-0 truncate">
                <span className="text-zinc-100 font-semibold truncate">Decorated MCP (Steroids)</span>
                <span className="text-[10px] text-emerald-400 font-bold shrink-0 whitespace-nowrap">
                  ({result.decoratedTokens} tokens · -{result.tokenSavingsPercent}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(decoratedJsonString, false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white flex items-center space-x-1.5 cursor-pointer transition-colors text-xs font-mono whitespace-nowrap shrink-0"
                title="Copy decorated payload"
              >
                {copiedDecorated ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedDecorated ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[380px] font-mono text-[11px] text-zinc-200 leading-relaxed bg-zinc-950 min-w-0">
              <pre className="overflow-x-auto">{decoratedJsonString}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Redactions */}
      {activeTab === "redactions" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Zero-Trust Interceptor scans every tool invocation and result payload for credentials, PII, and destructive side-effects before ingestion by the LLM.
          </p>
          {result.redactions.length === 0 ? (
            <div className="p-8 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
              <ShieldCheck className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2 opacity-80" />
              <span>No credentials or PII leaked in this tool response. All safe.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.redactions.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold whitespace-nowrap">
                        {item.type}
                      </span>
                      <span className="text-xs text-zinc-800 dark:text-zinc-200 font-medium font-mono">({item.count} matched)</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.details}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg font-bold shrink-0 whitespace-nowrap">
                    MASKED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Domain Enrichments */}
      {activeTab === "enrichments" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Domain decorators inject high-value contextual metadata (e.g. topology relations, breaking change risks, call graphs) so the LLM doesn't have to guess or hallucinate.
          </p>
          {result.domainEnrichments.length === 0 ? (
            <div className="p-8 text-center border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs font-mono">
              <Sparkles className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2 opacity-80" />
              <span>Enable Domain Enricher decorator in step 2 to inject smart source heuristics.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.domainEnrichments.map((en, i) => (
                <div key={i} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">{en.title}</h4>
                    {en.badge && (
                      <span className="text-[10px] font-mono px-3 py-1 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-semibold whitespace-nowrap shrink-0">
                        {en.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{en.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Pipeline Step Trace */}
      {activeTab === "trace" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Chronological execution trace through the active interceptor pipeline stages.
          </p>
          <div className="space-y-2.5">
            {result.pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-900 dark:text-zinc-100 font-mono shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{step.stepName}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 block text-[11px] mt-0.5 font-mono">{step.diffSummary}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0 font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-[10px] uppercase font-bold whitespace-nowrap">
                    {step.status}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">+{step.durationMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

