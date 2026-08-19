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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs flex flex-col space-y-4 transition-colors">
      {/* Top Banner with Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
            3. Steroid MCP Output & Interception Diff
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{tool.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              Payload transformed
            </span>
          </div>
        </div>

        {/* Live Stat Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
          <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold">{result.tokenSavingsPercent}% Tokens Cut</span>
            <span className="text-indigo-900/60 dark:text-indigo-300/60 text-[11px]">({result.originalTokens} → {result.decoratedTokens})</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{result.redactions.length} Secrets Shielded</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{result.estimatedLatencyDecoratedMs}ms (was {result.estimatedLatencyOriginalMs}ms)</span>
          </div>
        </div>
      </div>

      {/* Security Warnings if any */}
      {result.securityWarnings.length > 0 && (
        <div className="space-y-2">
          {result.securityWarnings.map((warn, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border flex items-start space-x-2.5 text-xs ${
                warn.severity === "blocked"
                  ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                  : "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="font-bold font-mono block">{warn.title}</span>
                <span className="opacity-90">{warn.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspector Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-100 dark:border-slate-800 text-xs pb-2 font-medium">
        <button
          onClick={() => setActiveTab("payloads")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "payloads"
              ? "bg-slate-900 dark:bg-indigo-600 text-white font-bold shadow-2xs"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Payload Diff (Raw vs Steroids)</span>
        </button>

        <button
          onClick={() => setActiveTab("redactions")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "redactions"
              ? "bg-slate-900 dark:bg-indigo-600 text-white font-bold shadow-2xs"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Audit ({result.redactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("enrichments")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "enrichments"
              ? "bg-slate-900 dark:bg-indigo-600 text-white font-bold shadow-2xs"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Domain Context ({result.domainEnrichments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trace")}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "trace"
              ? "bg-slate-900 dark:bg-indigo-600 text-white font-bold shadow-2xs"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
          <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-inner">
            <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <div className="flex gap-1 mr-1">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                </div>
                <span className="text-slate-300 font-semibold">Raw Standard MCP</span>
                <span className="text-[10px] text-slate-500">({result.originalTokens} tokens)</span>
              </div>
              <button
                onClick={() => handleCopy(rawJsonString, true)}
                className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer transition-colors"
                title="Copy raw payload"
              >
                {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedRaw ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-3.5 overflow-auto max-h-[380px] font-mono text-[11px] text-slate-400 leading-relaxed">
              <pre>{rawJsonString}</pre>
            </div>
          </div>

          {/* Right: Decorated MCP on Steroids Payload */}
          <div className="bg-slate-950 rounded-xl border border-indigo-900/60 ring-1 ring-indigo-500/20 flex flex-col overflow-hidden shadow-md">
            <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-indigo-900/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <div className="flex gap-1 mr-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/90" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/90" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/90" />
                </div>
                <span className="text-indigo-300 font-semibold">Decorated MCP (On Steroids)</span>
                <span className="text-[10px] text-indigo-400 font-bold">
                  ({result.decoratedTokens} tokens · -{result.tokenSavingsPercent}%)
                </span>
              </div>
              <button
                onClick={() => handleCopy(decoratedJsonString, false)}
                className="text-indigo-300 hover:text-indigo-100 flex items-center space-x-1 cursor-pointer transition-colors"
                title="Copy decorated payload"
              >
                {copiedDecorated ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copiedDecorated ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-3.5 overflow-auto max-h-[380px] font-mono text-[11px] text-slate-200 leading-relaxed bg-slate-950">
              <pre>{decoratedJsonString}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Redactions */}
      {activeTab === "redactions" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Zero-Trust Interceptor scans every tool invocation and result payload for credentials, PII, and destructive side-effects before ingestion by the LLM.
          </p>
          {result.redactions.length === 0 ? (
            <div className="p-6 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-mono">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2 opacity-80" />
              <span>No credentials or PII leaked in this tool response. All safe.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.redactions.map((item, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">({item.count} matched)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.details}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-bold shrink-0">
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Domain decorators inject high-value contextual metadata (e.g. topology relations, breaking change risks, call graphs) so the LLM doesn't have to guess or hallucinate.
          </p>
          {result.domainEnrichments.length === 0 ? (
            <div className="p-6 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-mono">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2 opacity-80" />
              <span>Enable Domain Enricher decorator in step 2 to inject smart source heuristics.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.domainEnrichments.map((en, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{en.title}</h4>
                    {en.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-medium">
                        {en.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{en.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Pipeline Step Trace */}
      {activeTab === "trace" && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological execution trace through the active interceptor pipeline stages.
          </p>
          <div className="space-y-2">
            {result.pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{step.stepName}</span>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">{step.diffSummary}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0 font-mono">
                  <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                    {step.status}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">+{step.durationMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

