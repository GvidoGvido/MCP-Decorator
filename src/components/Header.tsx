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
  ExternalLink,
  Copy,
  Check,
  Key,
  Menu,
  Layers,
  LayoutDashboard,
  Compass,
  MessageSquare,
  BookOpen,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type AppViewMode = "start" | "studio" | "expansions";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  totalTokensSaved: number;
  totalInterceptions: number;
  activeSteroidCount: number;
  viewMode: AppViewMode;
  onChangeViewMode: (mode: AppViewMode) => void;
  onOpenExport: () => void;
  onOpenAiSynthesizer: () => void;
  onOpenApiKeyModal: () => void;
  onOpenRadar?: () => void;
  onOpenHowTo?: () => void;
  onOpenChat?: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  totalTokensSaved,
  totalInterceptions,
  activeSteroidCount,
  viewMode,
  onChangeViewMode,
  onOpenExport,
  onOpenAiSynthesizer,
  onOpenApiKeyModal,
  onOpenRadar,
  onOpenHowTo,
  onOpenChat,
  hasApiKey,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header
        id="main-header"
        className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 shadow-2xs transition-colors duration-300 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
          {/* Left: Logo & Main Mode Tabs */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 shrink-0">
            {/* Logo */}
            <button
              onClick={() => onChangeViewMode("start")}
              className="flex items-center space-x-2 sm:space-x-2.5 text-left group cursor-pointer focus:outline-hidden shrink-0"
              title="Return to Start Overview"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0 border border-zinc-800 dark:border-zinc-200">
                <div className="w-3.5 h-3.5 border-2 border-current rotate-45 rounded-xs" />
              </div>
              <div className="shrink-0 flex items-center space-x-1.5">
                <span className="font-bold text-zinc-950 dark:text-zinc-50 text-xs sm:text-base tracking-tight whitespace-nowrap">
                  MCP Decorator
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-wider shrink-0 backdrop-blur-md">
                  Active Proxy
                </span>
              </div>
            </button>

            {/* Navigation View Switcher (Desktop) */}
            <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 backdrop-blur-md text-xs shrink-0 shadow-inner">
              <button
                id="nav-tab-start"
                onClick={() => onChangeViewMode("start")}
                className={`px-2.5 py-1.5 xl:px-3.5 xl:py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-[0.97] ${
                  viewMode === "start"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold border border-zinc-200 dark:border-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60"
                }`}
              >
                <Compass className={`w-3.5 h-3.5 shrink-0 ${viewMode === "start" ? "text-zinc-900 dark:text-zinc-100" : ""}`} />
                <span>Overview</span>
              </button>

              <button
                id="nav-tab-studio"
                onClick={() => onChangeViewMode("studio")}
                className={`px-2.5 py-1.5 xl:px-3.5 xl:py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-[0.97] ${
                  viewMode === "studio"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold border border-zinc-200 dark:border-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60"
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 shrink-0 ${viewMode === "studio" ? "text-zinc-900 dark:text-zinc-100" : ""}`} />
                <span>Pipeline Studio</span>
              </button>

              <button
                id="nav-tab-expansions"
                onClick={() => onChangeViewMode("expansions")}
                className={`px-2.5 py-1.5 xl:px-3.5 xl:py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-[0.97] ${
                  viewMode === "expansions"
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold border border-zinc-200 dark:border-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 shrink-0 ${viewMode === "expansions" ? "text-zinc-900 dark:text-zinc-100" : ""}`} />
                <span>Super-Tools Lab</span>
              </button>
            </div>
          </div>

          {/* Right: Actions and Live Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 flex-nowrap">
            {/* Live Metrics Pill */}
            <div className="hidden 2xl:flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-500 dark:text-zinc-400 font-mono shrink-0 whitespace-nowrap mr-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalInterceptions}</span>
                <span>Events</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{activeSteroidCount}</span>
                <span>Active</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">~{totalTokensSaved.toLocaleString()}</span>
                <span>Saved</span>
              </div>
            </div>

            {/* AI Copilot Button */}
            {onOpenChat && (
              <button
                id="btn-header-ai-copilot"
                onClick={onOpenChat}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
                title="Ask MCP AI Copilot"
              >
                <Bot className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <span className="hidden sm:inline">AI Copilot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {/* MCP Radar Button */}
            {onOpenRadar && (
              <button
                id="btn-header-mcp-radar"
                onClick={onOpenRadar}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
                title="Trending MCP Ecosystem Radar"
              >
                <Compass className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                <span className="hidden md:inline">Radar</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {/* AI Synthesizer */}
            <button
              id="btn-ai-synthesize"
              onClick={onOpenAiSynthesizer}
              className="hidden lg:flex px-2.5 py-1.5 xl:px-3 xl:py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-medium items-center space-x-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Generate custom decorators using Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" />
              <span className="hidden xl:inline">AI Synthesizer</span>
            </button>

            {/* How-To Visual Guide Button */}
            {onOpenHowTo && (
              <button
                id="btn-header-how-to-guide"
                onClick={onOpenHowTo}
                className="hidden xl:flex px-2.5 py-1.5 xl:px-3 xl:py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold items-center space-x-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                title="Visual How-To Guide & Examples"
              >
                <BookOpen className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300 shrink-0" />
                <span>Guide</span>
              </button>
            )}

            {/* API Key Modal Button */}
            <button
              id="btn-open-api-key"
              onClick={onOpenApiKeyModal}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                hasApiKey
                  ? "bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-2xs"
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              title={hasApiKey ? "Gemini API Key is Active" : "Set Custom Gemini API Key"}
            >
              <Key className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="hidden 2xl:inline">{hasApiKey ? "Key: Active" : "API Key"}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs transition-all cursor-pointer shrink-0"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
            </button>

            {/* GitHub Repo Button */}
            <a
              id="btn-github-repo-link"
              href="https://github.com/GvidoGvido/MCP-Decorator"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs transition-all cursor-pointer shrink-0"
              title="Open GitHub Repository in New Tab"
            >
              <Github className="w-3.5 h-3.5 shrink-0" />
            </a>

            {/* Export Config */}
            <button
              id="btn-export-config"
              onClick={onOpenExport}
              className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-medium text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap border border-zinc-800 dark:border-zinc-200"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Export</span>
            </button>

            {/* Mobile Navigation Menu Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 md:hidden rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3.5 space-y-3 text-xs overflow-hidden shadow-lg"
            >
              <div className="grid grid-cols-3 gap-2 pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <button
                  id="mobile-nav-tab-start"
                  onClick={() => {
                    onChangeViewMode("start");
                    setShowMobileMenu(false);
                  }}
                  className={`p-3 rounded-2xl text-center font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 cursor-pointer active:scale-95 border ${
                    viewMode === "start"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md border-zinc-900 dark:border-white ring-1 ring-zinc-900/10"
                      : "bg-zinc-100/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <Compass className={`w-4 h-4 shrink-0 transition-transform duration-200 ${viewMode === "start" ? "scale-110" : "group-hover:rotate-12"}`} />
                  <span className="font-semibold">Overview</span>
                </button>
                <button
                  id="mobile-nav-tab-studio"
                  onClick={() => {
                    onChangeViewMode("studio");
                    setShowMobileMenu(false);
                  }}
                  className={`p-3 rounded-2xl text-center font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 cursor-pointer active:scale-95 border ${
                    viewMode === "studio"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md border-zinc-900 dark:border-white ring-1 ring-zinc-900/10"
                      : "bg-zinc-100/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 shrink-0 transition-transform duration-200 ${viewMode === "studio" ? "scale-110" : ""}`} />
                  <span className="font-semibold">Studio</span>
                </button>
                <button
                  id="mobile-nav-tab-expansions"
                  onClick={() => {
                    onChangeViewMode("expansions");
                    setShowMobileMenu(false);
                  }}
                  className={`p-3 rounded-2xl text-center font-bold text-xs transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 cursor-pointer active:scale-95 border ${
                    viewMode === "expansions"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md border-zinc-900 dark:border-white ring-1 ring-zinc-900/10"
                      : "bg-zinc-100/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/80 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <Layers className={`w-4 h-4 shrink-0 transition-transform duration-200 ${viewMode === "expansions" ? "scale-110" : ""}`} />
                  <span className="font-semibold">Super-Tools</span>
                </button>
              </div>

              {/* Mobile Quick Utility Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {onOpenHowTo && (
                  <button
                    id="mobile-nav-how-to"
                    onClick={() => {
                      onOpenHowTo();
                      setShowMobileMenu(false);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold flex items-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>How-To Guide</span>
                  </button>
                )}

                {onOpenChat && (
                  <button
                    id="mobile-nav-chat"
                    onClick={() => {
                      onOpenChat();
                      setShowMobileMenu(false);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                      <span>AI Copilot</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </button>
                )}

                {onOpenRadar && (
                  <button
                    id="mobile-nav-radar"
                    onClick={() => {
                      onOpenRadar();
                      setShowMobileMenu(false);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                      <span>Radar</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </button>
                )}

                <button
                  id="mobile-nav-synthesizer"
                  onClick={() => {
                    onOpenAiSynthesizer();
                    setShowMobileMenu(false);
                  }}
                  className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold flex items-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  <span>Synthesizer</span>
                </button>

                <button
                  id="mobile-nav-apikey"
                  onClick={() => {
                    onOpenApiKeyModal();
                    setShowMobileMenu(false);
                  }}
                  className="col-span-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-zinc-500" />
                    <span>{hasApiKey ? "Gemini Key: Active" : "Configure API Key"}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
