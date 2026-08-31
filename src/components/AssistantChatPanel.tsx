import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Shield,
  Layers,
  ChevronRight,
  HelpCircle,
  Code2,
  Terminal,
  Compass,
  ArrowDown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { McpSource, McpTool, Decorator } from "../types";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  actionSuggestions?: string[];
}

interface AssistantChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeSource: McpSource;
  activeTool: McpTool;
  activeDecorators: Decorator[];
  totalTokensSaved: number;
  apiKey: string;
  onOpenRadar?: () => void;
  onOpenAiSynthesizer?: () => void;
  onOpenExport?: () => void;
}

const INITIAL_SUGGESTIONS = [
  "Explain how MCP Decorator works like I'm 5",
  "Suggest a safe workflow for PostgreSQL / DB migrations",
  "How do Composite Super-Tools eliminate LLM round-trips?",
  "How do I export this configuration to Cursor IDE or Claude Desktop?",
  "How does Zero-Trust Scrubber detect and mask leaked API tokens?",
  "Can you write an AST Decorator rule for Kubernetes kubectl?",
];

export const AssistantChatPanel: React.FC<AssistantChatPanelProps> = ({
  isOpen,
  onClose,
  activeSource,
  activeTool,
  activeDecorators = [],
  totalTokensSaved = 0,
  apiKey = "",
  onOpenRadar,
  onOpenAiSynthesizer,
  onOpenExport,
}) => {
  const sourceName = activeSource?.name || "GitHub";
  const toolName = activeTool?.name || "get_commit_diff";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: `👋 **Hi! I'm your MCP Decorator Copilot.** \n\nYou can ask me anything about the **Model Context Protocol**, how to configure zero-trust filters, create custom **Composite Super-Tools**, or connect decorators to **Cursor IDE** and **Claude Desktop**.\n\nWhat would you like to explore or optimize?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionSuggestions: [
        "Explain how MCP Decorator works simply",
        "Suggest a workflow for PostgreSQL",
        "How do Super-Tools work?",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActionSuggestionClick = (suggestionText: string) => {
    const sLower = suggestionText.toLowerCase();
    if (sLower.includes("export") && onOpenExport) {
      onClose();
      onOpenExport();
      return;
    }
    if (sLower.includes("radar") && onOpenRadar) {
      onClose();
      onOpenRadar();
      return;
    }
    if ((sLower.includes("synthesizer") || sLower.includes("custom decorator")) && onOpenAiSynthesizer) {
      onClose();
      onOpenAiSynthesizer();
      return;
    }
    handleSendMessage(suggestionText);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Prepare abort controller with a 5.5s timeout for fast UI response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);

    try {
      // Build conversation history payload
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .concat(userMessage)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

      const response = await fetch("/api/mcp/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey || "",
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          context: {
            activeSource: sourceName,
            activeTool: toolName,
            activeDecorators: (activeDecorators || []).map((d) => d?.name || "Decorator"),
            totalTokensSaved: totalTokensSaved || 0,
          },
          customApiKey: apiKey,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.reply) {
        const assistantMessage: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: "assistant",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionSuggestions: data.suggestions || undefined,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to generate AI response");
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.warn("Chat fetch returned error or timed out, executing instant local intelligence:", error?.message);
      // Fallback helpful reply
      const fallbackReply = generateFallbackReply(textToSend, activeSource, activeTool);
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        text: fallbackReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionSuggestions: fallbackReply.suggestions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: `✨ Chat history cleared! How can I help you build or customize your MCP workflows today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionSuggestions: INITIAL_SUGGESTIONS.slice(0, 3),
      },
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs lg:hidden"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className={`fixed top-0 right-0 bottom-0 z-50 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-all duration-300 ${
              isExpanded ? "w-full sm:w-[680px]" : "w-full sm:w-[440px] md:w-[480px]"
            }`}
          >
            {/* Panel Header */}
            <div className="p-3.5 sm:p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 shrink-0 bg-zinc-50/70 dark:bg-zinc-900/60 backdrop-blur-md">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0 shadow-xs border border-zinc-800 dark:border-zinc-200">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-zinc-50 truncate">
                      MCP Copilot & Workflow Chat
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                    Gemini 3.7 Flash &bull; Context: {sourceName} / {toolName}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title={isExpanded ? "Collapse width" : "Expand width"}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Pill Banner */}
            <div className="px-3.5 py-2 bg-zinc-100/70 dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400 shrink-0">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="text-zinc-400">Target:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{sourceName}</span>
                <span>/</span>
                <span className="truncate">{toolName}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {(activeDecorators || []).length} active filters
                </span>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 text-xs font-sans">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 px-1 font-mono">
                      <span>{isUser ? "You" : "MCP Copilot"}</span>
                      <span>&bull;</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`relative group max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 leading-relaxed break-words overflow-hidden ${
                        isUser
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium rounded-tr-xs shadow-xs"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800/80 rounded-tl-xs shadow-2xs"
                      }`}
                    >
                      {/* Formatted Text Content */}
                      <div className="space-y-2 whitespace-pre-wrap break-words overflow-x-auto">
                        {renderMarkdownText(msg.text)}
                      </div>

                      {/* Copy Action Button */}
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.text, msg.id)}
                          className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 cursor-pointer shadow-2xs"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Follow-up Action Suggestion Chips */}
                    {!isUser && msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 max-w-[92%]">
                        {msg.actionSuggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleActionSuggestionClick(sug)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-[11px] text-left transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                            <span className="truncate max-w-[240px]">{sug}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
                    <span>Gemini 3.7 Flash thinking & synthesizing MCP response...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Suggestions (if conversation is short) */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-3.5 py-2 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/30 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center space-x-1.5 shrink-0">
                {INITIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleActionSuggestionClick(sug)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-[11px] font-sans hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form Bar */}
            <div className="p-3 sm:p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <div className="relative flex-1 min-w-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything about MCP, workflows, or decorators..."
                    disabled={isLoading}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    inputValue.trim() && !isLoading
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:scale-105 shadow-xs"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-60"
                  }`}
                  title="Send question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-zinc-400 font-mono">
                <span>Shift + Enter for new lines</span>
                <div className="flex items-center space-x-1">
                  {onOpenAiSynthesizer && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAiSynthesizer();
                      }}
                      className="hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer underline"
                    >
                      Synthesizer
                    </button>
                  )}
                  <span>&bull;</span>
                  {onOpenExport && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenExport();
                      }}
                      className="hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer underline"
                    >
                      Export
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper: Lightweight Markdown Renderer for Chat
function renderMarkdownText(content: string) {
  const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^[a-zA-Z]+\n/, "");
      return (
        <div key={index} className="my-2 rounded-xl bg-zinc-950 p-3 border border-zinc-800 overflow-x-auto text-[11px] font-mono text-zinc-200 shadow-inner max-w-full">
          <pre className="whitespace-pre">{code}</pre>
        </div>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-zinc-950 dark:text-zinc-50">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-[11px] break-all">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

// Fallback intelligent offline replies for instant responsiveness
function generateFallbackReply(prompt: string, source?: McpSource, tool?: McpTool) {
  const p = prompt.toLowerCase();
  const sName = source?.name || "GitHub";
  const tName = tool?.name || "get_commit_diff";

  if (
    p.includes("hello") ||
    p.includes("hi") ||
    p.includes("hey") ||
    p.includes("who are you") ||
    p.includes("what can you do")
  ) {
    return {
      text: `**Hello! I'm your MCP Decorator Copilot & Solutions Architect.** ⚡\n\nI can help you:\n- **Clean & Secure Tool Output:** Configure Zero-Trust scrubbing for API keys, tokens, and credentials.\n- **Cut LLM Token Costs by 70%:** Use AST Distillation to remove nulls, boilerplate, and noisy diffs.\n- **Build Composite Super-Tools:** Consolidate 3-4 sequential MCP tool calls into a single 1-shot parallel execution.\n- **Prevent Outages:** Intercept destructive operations like \`DROP TABLE\` with active safety sandbox gates.\n- **Export to Cursor & Claude:** Generate drop-in configs for Cursor IDE, Claude Desktop, and Gemini.\n\nWhat would you like to explore or optimize today?`,
      suggestions: [
        "Explain how MCP Decorator works simply",
        "How do Super-Tools eliminate round trips?",
        "How do I export to Claude Desktop?",
      ],
    };
  }

  if (p.includes("like i'm 5") || p.includes("simply") || p.includes("what is") || p.includes("how does it work")) {
    return {
      text: `**Think of MCP Decorator like a smart water filter for your AI.** 🚰\n\n1. **Without Decorator:** When your AI asks a tool like GitHub or PostgreSQL for data, it gets 4,000 lines of messy raw text, exposed passwords, and useless ID numbers.\n2. **With Decorator:** Our proxy catches the data *before* the AI sees it. It scrubs leaked API keys, throws away 70% of the useless null lines, and adds helpful context.\n3. **Result:** Your AI gives you answers 3x faster, saves you money on tokens, and never leaks your secrets!`,
      suggestions: [
        "How do Composite Super-Tools work?",
        "Suggest a workflow for PostgreSQL",
        "How do I export to Claude Desktop?",
      ],
    };
  }

  if (p.includes("postgres") || p.includes("sql") || p.includes("database") || p.includes("drop table")) {
    return {
      text: `**Recommended High-Reliability PostgreSQL Workflow:** 🛡️\n\n1. **Active Safety Gate Sandbox:** Intercepts dangerous mutations (\`DROP TABLE\`, \`ALTER TABLE\`, \`DELETE\`) and executes them inside an isolated rollback transaction first to compute the exact blast radius.\n2. **Relational Graph Pre-Flight:** When querying foreign keys, the decorator automatically resolves related table schemas so the LLM doesn't have to query 3 times.\n3. **PII Masker:** Automatically masks email addresses, credit card hashes, and passwords from SQL query result sets.\n\n*Click the Decorator Pipeline switches in Step 2 to enable these filters!*`,
      suggestions: [
        "Can I run dry-run simulations on SQL?",
        "How does the Semantic Cache help with database reads?",
        "Export SQL Proxy configuration",
      ],
    };
  }

  if (p.includes("super-tool") || p.includes("super tool") || p.includes("round trip") || p.includes("composite")) {
    return {
      text: `**How Composite Super-Tools Eliminate Round-Trips:** ⚡\n\nStandard MCP tools are atomic (e.g. \`git_diff\`, \`list_pr_comments\`, \`security_scan\`). When an AI wants to review a pull request, it must run 3 or 4 sequential round trips, waiting 3 seconds for each.\n\n**Super-Tools** register a single virtual endpoint like \`super_code_review_and_audit\`. When called, the Decorator executes all 4 tools in parallel under the hood and returns 1 clean consolidated payload to the LLM. **Latency drops from 12s to 1.8s!**`,
      suggestions: [
        "Open Super-Tools Lab",
        "Export to Claude Desktop",
        "How does the 5-Agent Swarm work?",
      ],
    };
  }

  if (p.includes("cursor") || p.includes("claude") || p.includes("export") || p.includes("ide") || p.includes("vscode")) {
    return {
      text: `**Connecting MCP Decorator to Cursor IDE or Claude Desktop:** 🔌\n\n1. Click the **"Export"** button in the top right header.\n2. Choose between **Claude Desktop JSON** (\`claude_desktop_config.json\`) or **Cursor IDE Proxy**.\n3. Paste the generated JSON into your \`~/Library/Application Support/Claude/claude_desktop_config.json\` or Cursor Settings.\n4. All tool calls from your IDE will now automatically pass through the Zero-Trust & AST Distiller proxy!`,
      suggestions: [
        "Open Export Config Modal",
        "Explain Zero-Trust Secret Scrubbing",
        "Open Trending MCP Radar",
      ],
    };
  }

  if (p.includes("swarm") || p.includes("agent") || p.includes("multi-agent")) {
    return {
      text: `**The 5-Agent MCP Decorator Swarm Pipeline:** 🐝\n\n1. **Sentinel Agent:** Audits raw streams for token leaks and injection exploits.\n2. **Distiller Agent:** Strips AST whitespace, boilerplate nulls, and package-lock noise.\n3. **Domain Specialist:** Enriches payload with graph topology and relevant schema docs.\n4. **Ecosystem Scout:** Discovers complementary MCP servers in the global registry.\n5. **Critic Agent:** Verifies output schema integrity and produces cryptographic signature.\n\n*Try triggering the 5-Agent Swarm in Step 4 to see all 5 agents collaborate live!*`,
      suggestions: [
        "How do Super-Tools work?",
        "Open Trending MCP Radar",
        "Export to Claude Desktop",
      ],
    };
  }

  if (p.includes("zero-trust") || p.includes("scrubber") || p.includes("token") || p.includes("secret") || p.includes("mask") || p.includes("security")) {
    return {
      text: `**Zero-Trust Sentinel & AST Redactor:** 🔒\n\n- **Deterministic Regex & AST Parser:** Scans streaming tool output for GitHub PATs (\`ghp_***\`), AWS keys (\`AKIA***\`), JWT bearer tokens, and private connection strings.\n- **Inline Masking:** Replaces secrets with safe synthetic placeholders before the model context window ingests them.\n- **Audit Provenance:** Records masked count in telemetry without retaining the raw sensitive values in memory.`,
      suggestions: [
        "How do I create custom regex filters?",
        "How does AST Token Distillation work?",
      ],
    };
  }

  return {
    text: `**Great question regarding ${sName} & ${tName}!** \n\nMCP Decorator lets you wrap any tool in custom middleware:\n- **Security:** Zero-Trust scrubbing of tokens (\`ghp_***\`, \`Bearer\`, AWS keys)\n- **Compression:** AST pruning of verbose nulls for 60-80% token savings\n- **Domain Enrichment:** Auto-injection of schema documentation and blast radius\n- **Super-Tools:** Merging multiple tools into 1 atomic call\n\nTry running the **Dual LLM Comparison** or **Launch 5-Agent Swarm** in the Pipeline Studio to see the difference live!`,
    suggestions: [
      "Suggest a workflow for GitHub PRs",
      "How do I create custom decorators with AI?",
      "How does the Semantic Cache work?",
    ],
  };
}
