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
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">AI Decorator Synthesizer</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Craft custom steroid decorators for <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{activeSource.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input prompt */}
        <div className="py-4 space-y-2 shrink-0">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block font-mono uppercase text-[11px]">
            What superpowers or guardrails do you want to add to this MCP?
          </label>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={goalPrompt}
              onChange={(e) => setGoalPrompt(e.target.value)}
              className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 transition-all"
            />
            <button
              onClick={handleSynthesize}
              disabled={loading || !goalPrompt.trim()}
              className="px-5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-2 shrink-0 shadow-xs whitespace-nowrap"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40 space-y-2 flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-bold whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{item.description}</p>
                      {item.rationale && (
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-mono">
                          Rationale: {item.rationale}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdd(item)}
                      disabled={isAdded}
                      className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors shrink-0 whitespace-nowrap ${
                        isAdded
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                          : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white cursor-pointer shadow-xs font-semibold"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Pipeline</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Inject Decorator</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-500 dark:text-zinc-400 text-xs">
              Enter your prompt above and click "Synthesize Decorators" to create custom domain and compression middleware for this MCP.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

