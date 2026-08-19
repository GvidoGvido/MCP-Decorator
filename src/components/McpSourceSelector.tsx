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
} from "lucide-react";

interface McpSourceSelectorProps {
  sources: McpSource[];
  activeSource: McpSource;
  activeTool: McpTool;
  onSelectSource: (source: McpSource) => void;
  onSelectTool: (tool: McpTool) => void;
  onAddNewCustomMcp: (customSource: McpSource) => void;
}

export const McpSourceSelector: React.FC<McpSourceSelectorProps> = ({
  sources,
  activeSource,
  activeTool,
  onSelectSource,
  onSelectTool,
  onAddNewCustomMcp,
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
        return <GitBranch className="w-4 h-4 text-slate-700" />;
      case "Database":
        return <Database className="w-4 h-4 text-indigo-600" />;
      case "FolderTree":
        return <FolderTree className="w-4 h-4 text-emerald-600" />;
      case "Activity":
        return <Activity className="w-4 h-4 text-purple-600" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-sky-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-700" />;
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
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs transition-colors">
      {/* Source selector tabs */}
      <div className="flex flex-col space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              1. Incoming Sources
            </h2>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
              {sources.length} SOURCES READY
            </span>
          </div>

          <button
            id="btn-add-custom-mcp"
            onClick={() => setShowCustomModal(true)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-1 font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ADD CUSTOM MCP</span>
          </button>
        </div>

        {/* MCP Sources List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
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
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-500/80 dark:border-indigo-500 shadow-xs ring-2 ring-indigo-500/10"
                    : "bg-white/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-1.5 rounded-md ${isSelected ? "bg-white dark:bg-slate-800 shadow-xs border border-indigo-100 dark:border-indigo-900" : "bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"}`}>
                    {getSourceIcon(src.icon)}
                  </div>
                  {isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 rounded font-medium">
                      {src.category}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{src.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{src.tools.length} tool(s)</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool sub-selector inside active MCP */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-1 mr-1">
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Tool:</span>
          </span>

          {activeSource.tools.map((tool) => {
            const isToolSelected = tool.id === activeTool.id;
            return (
              <button
                key={tool.id}
                id={`tool-btn-${tool.id}`}
                onClick={() => onSelectTool(tool)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                  isToolSelected
                    ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 font-medium shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tool.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom MCP Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-100 shadow-xl">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ingest Custom MCP Server / Tool</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add any external MCP definition to the decorator pipeline</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">MCP Server Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe Billing MCP, Kubernetes Pods MCP"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tool Name (Method)</label>
                <input
                  type="text"
                  placeholder="e.g. stripe.get_customer, k8s.get_logs"
                  value={customToolName}
                  onChange={(e) => setCustomToolName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Sample Raw Tool Response (JSON)</label>
                <textarea
                  rows={6}
                  value={customSampleJson}
                  onChange={(e) => setCustomSampleJson(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-2.5">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustom}
                disabled={!customName.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
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

