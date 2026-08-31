import React, { useState } from "react";
import { McpSource, McpTool } from "../types";
import {
  GitBranch,
  Database,
  FolderTree,
  Activity,
  Globe,
  Plus,
  Layers,
  Wrench,
  Sparkles,
  X,
  Compass,
  Radar,
} from "lucide-react";

interface McpSourceSelectorProps {
  sources: McpSource[];
  activeSource: McpSource;
  activeTool: McpTool;
  onSelectSource: (source: McpSource) => void;
  onSelectTool: (tool: McpTool) => void;
  onAddNewCustomMcp: (customSource: McpSource) => void;
  onOpenRadar?: () => void;
}

export const McpSourceSelector: React.FC<McpSourceSelectorProps> = ({
  sources,
  activeSource,
  activeTool,
  onSelectSource,
  onSelectTool,
  onAddNewCustomMcp,
  onOpenRadar,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customToolName, setCustomToolName] = useState("");
  const [customSampleJson, setCustomSampleJson] = useState(`{
  "status": "success",
  "apiKey": "sk_test_998129841289412984",
  "userEmail": "developer@enterprise.internal",
  "records": [
    { "id": 1, "details": "Critical transaction data" },
    { "id": 2, "details": "Audit event log" }
  ]
}`);

  const getSourceIcon = (iconName: string) => {
    switch (iconName) {
      case "GitBranch":
        return <GitBranch className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "Database":
        return <Database className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "FolderTree":
        return <FolderTree className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "Activity":
        return <Activity className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
    }
  };

  const handleCreateCustom = () => {
    if (!customName.trim()) return;

    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(customSampleJson);
    } catch {
      parsedPayload = { raw: customSampleJson };
    }

    const newSource: McpSource = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      tagline: "Custom Ingested MCP Server",
      icon: "Layers",
      category: "custom",
      systemDirectivesDefault: "Analyze custom payload with enhanced decorator protection.",
      availableDecorators: [
        {
          id: "custom-sec",
          name: "Secret & PII Redactor",
          category: "security",
          description: "Scans for tokens, passwords, and private identifiers.",
          enabled: true,
          isSteroid: true,
          badge: "Shield Active",
          config: {},
        },
        {
          id: "custom-comp",
          name: "JSON Distiller",
          category: "compression",
          description: "Condenses duplicate array fields and large string chunks.",
          enabled: true,
          isSteroid: true,
          badge: "-60% Tokens",
          config: {},
        },
        {
          id: "custom-dom",
          name: "Custom Schema Enricher",
          category: "domain",
          description: "Injects structure metadata and type annotations.",
          enabled: true,
          isSteroid: true,
          badge: "Context Ready",
          config: {},
        },
      ],
      tools: [
        {
          id: `tool-${Date.now()}`,
          name: customToolName.trim() || `${customName.toLowerCase().replace(/\s+/g, "_")}.inspect`,
          description: "Custom MCP tool inspector",
          category: "custom",
          inputSchema: { type: "object", properties: { query: { type: "string" } } },
          sampleArgs: { query: "inspect" },
          sampleRawResponse: parsedPayload,
          suggestedPrompt: "Analyze the output and highlight key security or performance insights.",
        },
      ],
    };

    onAddNewCustomMcp(newSource);
    onSelectSource(newSource);
    onSelectTool(newSource.tools[0]);
    setShowCustomModal(false);
    setCustomName("");
    setCustomToolName("");
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 space-y-5 transition-colors duration-300">
      {/* Source selector tabs */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
              1. Ingested MCP Sources
            </h2>
            <span className="text-[10px] text-zinc-900 dark:text-zinc-100 font-mono font-bold bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
              {sources.length} READY
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenRadar && (
              <button
                id="btn-open-mcp-radar"
                onClick={onOpenRadar}
                className="text-xs text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center space-x-1.5 font-bold transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">TRENDING RADAR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}
            <button
              id="btn-add-custom-mcp"
              onClick={() => setShowCustomModal(true)}
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center space-x-1.5 font-bold transition-colors cursor-pointer font-mono px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 whitespace-nowrap border border-zinc-200 dark:border-zinc-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ADD CUSTOM MCP</span>
            </button>
          </div>
        </div>

        {/* MCP Sources List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {sources.map((src) => {
            const isSelected = src.id === activeSource.id;
            return (
              <button
                key={src.id}
                id={`source-btn-${src.id}`}
                onClick={() => {
                  onSelectSource(src);
                  onSelectTool(src.tools[0]);
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 shadow-xs ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"}`}>
                    {getSourceIcon(src.icon)}
                  </div>
                  {isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                  ) : (
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-md font-semibold">
                      {src.category}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{src.name}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{src.tools.length} tool(s)</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool sub-selector inside active MCP */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center space-x-1.5 mr-1 font-mono uppercase text-[11px] shrink-0">
            <Wrench className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 shrink-0" />
            <span>Target Tool:</span>
          </span>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {activeSource.tools.map((tool) => {
              const isToolSelected = tool.id === activeTool.id;
              return (
                <button
                  key={tool.id}
                  id={`tool-btn-${tool.id}`}
                  onClick={() => onSelectTool(tool)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border whitespace-nowrap ${
                    isToolSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-transparent font-bold shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom MCP Modal */}
      {showCustomModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCustomModal(false);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl space-y-4 relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-tight">Ingest Custom MCP Server / Tool</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Add any external MCP definition to the decorator pipeline</p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1 font-mono uppercase text-[11px]">MCP Server Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe Billing MCP, Kubernetes Pods MCP"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1 font-mono uppercase text-[11px]">Tool Name (Method)</label>
                <input
                  type="text"
                  placeholder="e.g. stripe.get_customer, k8s.get_logs"
                  value={customToolName}
                  onChange={(e) => setCustomToolName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1 font-mono uppercase text-[11px]">Sample Raw Tool Response (JSON)</label>
                <textarea
                  rows={6}
                  value={customSampleJson}
                  onChange={(e) => setCustomSampleJson(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-zinc-800 dark:text-zinc-200 font-mono text-[11px] focus:outline-hidden focus:ring-1 focus:ring-zinc-400 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustom}
                disabled={!customName.trim()}
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-xs whitespace-nowrap"
              >
                Add & Decorate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

