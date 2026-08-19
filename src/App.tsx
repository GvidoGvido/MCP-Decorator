import React, { useState, useMemo, useEffect } from "react";
import { PRESET_MCPS } from "./data/presetMcps";
import {
  Decorator,
  LlmExecutionComparison,
  McpSource,
  McpTool,
  MultiAgentSwarmResult,
} from "./types";
import { applyDecorators } from "./services/decoratorEngine";
import { Header } from "./components/Header";
import { McpSourceSelector } from "./components/McpSourceSelector";
import { DecoratorPipelineBuilder } from "./components/DecoratorPipelineBuilder";
import { InterceptionInspector } from "./components/InterceptionInspector";
import { LlmRunnerBox } from "./components/LlmRunnerBox";
import { AiDecoratorSynthesizer } from "./components/AiDecoratorSynthesizer";
import { CodeExportModal } from "./components/CodeExportModal";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mcp_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mcp_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mcp_theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [sources, setSources] = useState<McpSource[]>(PRESET_MCPS);
  const [activeSourceId, setActiveSourceId] = useState<string>("github");
  const [activeToolId, setActiveToolId] = useState<string>("get_commit_diff");

  // Keep per-source decorator settings
  const [decoratorsMap, setDecoratorsMap] = useState<Record<string, Decorator[]>>(() => {
    const initial: Record<string, Decorator[]> = {};
    for (const src of PRESET_MCPS) {
      initial[src.id] = src.availableDecorators;
    }
    return initial;
  });

  const [comparisonResult, setComparisonResult] = useState<LlmExecutionComparison | null>(null);
  const [swarmResult, setSwarmResult] = useState<MultiAgentSwarmResult | null>(null);
  const [isRunningLlm, setIsRunningLlm] = useState(false);
  const [isRunningSwarm, setIsRunningSwarm] = useState(false);
  const [totalInterceptions, setTotalInterceptions] = useState(42);
  const [totalTokensSaved, setTotalTokensSaved] = useState(14820);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAiSynthesizerOpen, setIsAiSynthesizerOpen] = useState(false);

  // Active source & tool objects
  const activeSource = useMemo(() => {
    return sources.find((s) => s.id === activeSourceId) || sources[0];
  }, [sources, activeSourceId]);

  const activeTool = useMemo(() => {
    return activeSource.tools.find((t) => t.id === activeToolId) || activeSource.tools[0];
  }, [activeSource, activeToolId]);

  const currentDecorators = useMemo(() => {
    return decoratorsMap[activeSource.id] || activeSource.availableDecorators;
  }, [decoratorsMap, activeSource]);

  // Execute the decoration pipeline
  const decorationResult = useMemo(() => {
    return applyDecorators(
      activeTool.sampleRawResponse,
      currentDecorators,
      activeSource.category,
      activeSource.systemDirectivesDefault
    );
  }, [activeTool, currentDecorators, activeSource]);

  // Update cumulative metrics
  useEffect(() => {
    setTotalInterceptions((prev) => prev + 1);
    setTotalTokensSaved((prev) => prev + Math.max(0, decorationResult.originalTokens - decorationResult.decoratedTokens));
  }, [activeTool.id, currentDecorators]);

  // Toggle decorator
  const handleToggleDecorator = (decoratorId: string) => {
    setDecoratorsMap((prev) => {
      const currentList = prev[activeSource.id] || activeSource.availableDecorators;
      const updated = currentList.map((d) =>
        d.id === decoratorId ? { ...d, enabled: !d.enabled } : d
      );
      return { ...prev, [activeSource.id]: updated };
    });
  };

  const handleToggleAll = (enable: boolean) => {
    setDecoratorsMap((prev) => {
      const currentList = prev[activeSource.id] || activeSource.availableDecorators;
      const updated = currentList.map((d) => ({ ...d, enabled: enable }));
      return { ...prev, [activeSource.id]: updated };
    });
  };

  // Add custom MCP
  const handleAddNewCustomMcp = (newSource: McpSource) => {
    setSources((prev) => [...prev, newSource]);
    setDecoratorsMap((prev) => ({
      ...prev,
      [newSource.id]: newSource.availableDecorators,
    }));
    setActiveSourceId(newSource.id);
    setActiveToolId(newSource.tools[0].id);
  };

  // Add AI synthesized decorator
  const handleAddSuggestedDecorator = (newDecorator: Decorator) => {
    setDecoratorsMap((prev) => {
      const currentList = prev[activeSource.id] || activeSource.availableDecorators;
      return { ...prev, [activeSource.id]: [...currentList, newDecorator] };
    });
  };

  // Run single-agent LLM execution comparison
  const handleRunLlm = async (prompt: string) => {
    setIsRunningLlm(true);
    try {
      const response = await fetch("/api/mcp/llm-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mcpToolName: activeTool.name,
          rawPayload: decorationResult.originalPayload,
          decoratedPayload: decorationResult.decoratedPayload,
          systemDirectives: decorationResult.systemDirectivesApplied,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setComparisonResult({
          prompt,
          rawResult: data.rawResult,
          decoratedResult: data.decoratedResult,
          mode: data.mode,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (error) {
      console.error("Error executing LLM comparison:", error);
    } finally {
      setIsRunningLlm(false);
    }
  };

  // Run Multi-Agent Swarm execution
  const handleRunSwarm = async (prompt: string) => {
    setIsRunningSwarm(true);
    try {
      const response = await fetch("/api/mcp/swarm-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mcpToolName: activeTool.name,
          rawPayload: decorationResult.originalPayload,
          decoratedPayload: decorationResult.decoratedPayload,
          systemDirectives: decorationResult.systemDirectivesApplied,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSwarmResult({
          prompt: data.prompt,
          swarmAgents: data.swarmAgents,
          consensusVerdict: data.consensusVerdict,
          primaryReasonerOutput: data.primaryReasonerOutput,
          rawSingleAgentOutput: data.rawSingleAgentOutput,
          tokensSavedTotal: data.tokensSavedTotal,
          totalSwarmLatencyMs: data.totalSwarmLatencyMs,
          mode: data.mode,
          timestamp: data.timestamp,
        });
      }
    } catch (error) {
      console.error("Error executing Swarm:", error);
    } finally {
      setIsRunningSwarm(false);
    }
  };

  const activeSteroidCount = currentDecorators.filter((d) => d.enabled).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-600 transition-colors duration-200">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        totalTokensSaved={totalTokensSaved}
        totalInterceptions={totalInterceptions}
        activeSteroidCount={activeSteroidCount}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAiSynthesizer={() => setIsAiSynthesizerOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Step 1: MCP Source Selector */}
        <McpSourceSelector
          sources={sources}
          activeSource={activeSource}
          activeTool={activeTool}
          onSelectSource={(src) => {
            setActiveSourceId(src.id);
            setActiveToolId(src.tools[0].id);
            setComparisonResult(null);
            setSwarmResult(null);
          }}
          onSelectTool={(tool) => {
            setActiveToolId(tool.id);
            setComparisonResult(null);
            setSwarmResult(null);
          }}
          onAddNewCustomMcp={handleAddNewCustomMcp}
        />

        {/* Step 2: Decorator Pipeline Builder */}
        <DecoratorPipelineBuilder
          decorators={currentDecorators}
          onToggleDecorator={handleToggleDecorator}
          onToggleAll={handleToggleAll}
        />

        {/* Step 3: Interception & Steroid Inspector */}
        <InterceptionInspector tool={activeTool} result={decorationResult} />

        {/* Step 4: Execution Sandbox (Multi-Agent Swarm + Dual LLM) */}
        <LlmRunnerBox
          tool={activeTool}
          decorationResult={decorationResult}
          comparisonResult={comparisonResult}
          swarmResult={swarmResult}
          isRunning={isRunningLlm}
          isRunningSwarm={isRunningSwarm}
          onRunLlm={handleRunLlm}
          onRunSwarm={handleRunSwarm}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4 text-xs text-slate-500 dark:text-slate-400 font-sans transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">MCP Decorator</span>
            <span>• Model Context Protocol Interception & Enrichment Layer</span>
          </div>
          <span className="text-slate-400 dark:text-slate-500">Autonomous Multi-Agent Swarm • Zero-Trust Shield • AST Distiller</span>
        </div>
      </footer>

      {/* Modals */}
      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeSource={activeSource}
        activeDecorators={currentDecorators.filter((d) => d.enabled)}
      />

      <AiDecoratorSynthesizer
        isOpen={isAiSynthesizerOpen}
        onClose={() => setIsAiSynthesizerOpen(false)}
        activeSource={activeSource}
        onAddSuggestedDecorator={handleAddSuggestedDecorator}
      />
    </div>
  );
}
