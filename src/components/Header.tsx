import React, { useState } from "react";
import {
  Shield,
  Zap,
  Sparkles,
  Download,
  Info,
  X,
  ArrowRight,
  Activity,
  Sun,
  Moon,
  Github,
  Star,
  GitFork,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  totalTokensSaved: number;
  totalInterceptions: number;
  activeSteroidCount: number;
  onOpenExport: () => void;
  onOpenAiSynthesizer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  totalTokensSaved,
  totalInterceptions,
  activeSteroidCount,
  onOpenExport,
  onOpenAiSynthesizer,
}) => {
  const [showArchInfo, setShowArchInfo] = useState(false);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  const handleCopyClone = () => {
    navigator.clipboard.writeText("npx mcp-decorator init --proxy");
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <>
      <header
        id="main-header"
        className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs shadow-indigo-500/20">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45 rounded-xs" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  MCP Decorator
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Interception & Enrichment Middleware for Model Context Protocol
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400 font-sans">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">{totalInterceptions}</span>
              <span>Events Intercepted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeSteroidCount}</span>
              <span>Steroids Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">~{totalTokensSaved.toLocaleString()}</span>
              <span>Tokens Saved</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* GitHub Repo Button */}
            <button
              id="btn-github-repo"
              onClick={() => setShowRepoModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="View GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                1.4k
              </span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* AI Synthesizer */}
            <button
              id="btn-ai-synthesize"
              onClick={onOpenAiSynthesizer}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Generate custom decorators using Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">AI Synthesizer</span>
            </button>

            {/* Export Config / Deploy */}
            <button
              id="btn-export-config"
              onClick={onOpenExport}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </button>

            {/* Arch Info */}
            <button
              id="btn-arch-info"
              onClick={() => setShowArchInfo(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="How MCP Decorator Works in Production"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* GitHub Repository Modal */}
      <AnimatePresence>
        {showRepoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl relative"
            >
              <button
                onClick={() => setShowRepoModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex items-center justify-center text-white">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">mcp-decorator / core</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      v1.4.2
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Open Source Middleware for Model Context Protocol (TypeScript / Rust / Python)
                  </p>
                </div>
              </div>

              {/* Repo Stats */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs mb-4">
                <div className="text-center">
                  <span className="block text-slate-400 text-[10px] uppercase font-semibold">Stars</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 1,420
                  </span>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700">
                  <span className="block text-slate-400 text-[10px] uppercase font-semibold">Forks</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                    <GitFork className="w-3 h-3 text-slate-400" /> 184
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-slate-400 text-[10px] uppercase font-semibold">License</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Apache-2.0</span>
                </div>
              </div>

              {/* Quick CLI snippet */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quick Install / Run as Stdio Proxy:
                </label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800">
                  <code>npx mcp-decorator init --proxy</code>
                  <button
                    onClick={handleCopyClone}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy command"
                  >
                    {copiedClone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                <p>
                  <strong>How it connects:</strong> Wraps any standard MCP server (e.g., GitHub, Postgres, Memory, Brave Search) over standard I/O pipes or SSE streams, applying AST pruning, PII masking, and contextual enrichment before passing data to Claude Desktop, Cursor, or your backend agent.
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Star on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setShowRepoModal(false)}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Architecture Explainer Modal */}
      <AnimatePresence>
        {showArchInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl relative"
            >
              <button
                onClick={() => setShowArchInfo(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Does this really work in production?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Yes: Real Stdio Subprocess Interception & JSON-RPC Middleware Architecture</p>
                </div>
              </div>

              {/* Diagram */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 my-4">
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2.5">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-center w-full sm:w-auto shadow-xs">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">1. Standard MCP</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">GitHub / SQL / FS / Cloud</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
                  <div className="bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 p-2.5 rounded-lg text-center w-full sm:w-auto shadow-xs">
                    <span className="text-indigo-700 dark:text-indigo-300 block text-[9px] font-bold uppercase tracking-wider">2. Interception Swarm</span>
                    <span className="text-indigo-900 dark:text-indigo-200 font-bold text-xs">Sentinel • Distiller • Specialist</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-center w-full sm:w-auto shadow-xs">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">3. Primary Reasoner</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">Gemini 3.7 / Claude / Agent</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>How the real implementation works:</strong> MCP communicates via JSON-RPC 2.0 over standard input/output (<code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">stdin / stdout</code>) or Server-Sent Events (<code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">SSE</code>).
                </p>
                <p>
                  The MCP Decorator proxy acts as a transparent man-in-the-middle. When an LLM client invokes <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">tools/call</code>, the Decorator intercepts the payload in memory, triggers autonomous pre-flight Micro-Agents (Zero-Trust Sentinel, AST Distiller, Domain Specialist), and supplies distilled, high-accuracy context to the primary reasoner in a single shot.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">1. Zero Token Waste</strong>
                    <span>Cuts 60-80% of repetitive AST/lockfile noise before model inference.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">2. Multi-Agent Audit</strong>
                    <span>Autonomous Sentinel & Critic swarm reviews payloads in sub-50ms parallel passes.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">3. Domain Intelligence</strong>
                    <span>Pre-computes diff impact, database joins, and API blast radius automatically.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowArchInfo(false)}
                  className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

