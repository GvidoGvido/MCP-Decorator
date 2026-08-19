import React, { useState } from "react";
import { Sparkles, X, Plus, Check } from "lucide-react";
import { Decorator, McpSource } from "../types";

interface AiDecoratorSynthesizerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSource: McpSource;
  onAddSuggestedDecorator: (decorator: Decorator) => void;
}

export const AiDecoratorSynthesizer: React.FC<AiDecoratorSynthesizerProps> = ({
  isOpen,
  onClose,
  activeSource,
  onAddSuggestedDecorator,
}) => {
  const [goalPrompt, setGoalPrompt] = useState(
    `Enhance ${activeSource.name} to minimize token usage, strip sensitive credentials, and add domain summaries.`
  );
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleSynthesize = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mcp/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcpName: activeSource.name,
          toolSchema: activeSource.tools[0]?.inputSchema || {},
          userGoal: goalPrompt,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error("Failed to synthesize suggestions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (item: any) => {
    const newDecorator: Decorator = {
      id: item.id || `ai-${Date.now()}`,
      name: item.name || "AI Generated Steroid",
      category: item.category || "domain",
      description: item.description || "AI Synthesized Decorator",
      enabled: true,
      isSteroid: true,
      badge: "AI Crafted",
      config: typeof item.configSnippet === "string" ? JSON.parse(item.configSnippet || "{}") : {},
    };

    onAddSuggestedDecorator(newDecorator);
    setAddedIds((prev) => new Set(prev).add(item.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Decorator Synthesizer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Craft custom steroid decorators for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activeSource.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input prompt */}
        <div className="py-4 space-y-2 shrink-0">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            What superpowers or guardrails do you want to add to this MCP?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={goalPrompt}
              onChange={(e) => setGoalPrompt(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />
            <button
              onClick={handleSynthesize}
              disabled={loading || !goalPrompt.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1.5 shrink-0 shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Decorators</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestions list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {suggestions.length > 0 ? (
            suggestions.map((item, idx) => {
              const isAdded = addedIds.has(item.id);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                      {item.rationale && (
                        <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1 italic">
                          Rationale: {item.rationale}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(item)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors shrink-0 ${
                        isAdded
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white cursor-pointer shadow-xs"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added to Pipeline</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Inject Decorator</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs">
              Enter your prompt above and click "Synthesize Decorators" to create custom domain and compression middleware for this MCP.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

