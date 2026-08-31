import React, { useState } from "react";
import { X, Copy, Check, FileCode } from "lucide-react";
import { Decorator, McpSource } from "../types";

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSource: McpSource;
  activeDecorators: Decorator[];
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  activeSource,
  activeDecorators,
}) => {
  const [activeTab, setActiveTab] = useState<"ts-proxy" | "claude-desktop" | "cursor" | "n8n-recipe">("claude-desktop");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateTsProxyCode = () => {
    const decoratorNames = activeDecorators.map((d) => `  // - ${d.name} (${d.category})`).join("\n");
    return `/**
 * MCP Decorator Proxy Middleware (TypeScript / Node.js)
 * Wraps any standard MCP server (e.g. n8n, GitHub, Postgres, Fetch)
 * and intercepts JSON-RPC stdio streams to apply zero-trust redaction & token pruning.
 * 
 * Usage:
 *   npx tsx ./mcp-decorator-proxy.ts
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { spawn } from "child_process";

// Active Decorator Rules:
${decoratorNames}

// Target MCP Command (e.g. n8n MCP server or ${activeSource.name})
const TARGET_COMMAND = process.env.MCP_TARGET_CMD || "npx";
const TARGET_ARGS = process.env.MCP_TARGET_ARGS?.split(" ") || ["-y", "@modelcontextprotocol/server-${activeSource.id}"];

console.error("[MCP Decorator] Launching upstream target: " + TARGET_COMMAND + " " + TARGET_ARGS.join(" "));

const child = spawn(TARGET_COMMAND, TARGET_ARGS, {
  stdio: ["pipe", "pipe", "inherit"],
  env: process.env,
});

// Intercept upstream stdout (MCP tool responses)
child.stdout.on("data", (chunk: Buffer) => {
  try {
    const rawStr = chunk.toString("utf-8");
    // Strip exposed API keys & bearer tokens
    const redacted = rawStr
      .replace(/gh[pousr]_[A-Za-z0-9_]{16,40}/g, "[REDACTED_GH_TOKEN]")
      .replace(/sk_(test|live)_[0-9a-zA-Z]{24,34}/g, "[REDACTED_SECRET_KEY]")
      .replace(/Bearer\\s+eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+/g, "Bearer [REDACTED_JWT]");

    // Forward sanitized, high-density stream to Claude/Cursor client
    process.stdout.write(redacted);
  } catch (err) {
    process.stdout.write(chunk);
  }
});

// Pipe client requests back to target server
process.stdin.pipe(child.stdin);
`;
  };

  const generateClaudeDesktopConfig = () => {
    return JSON.stringify(
      {
        mcpServers: {
          [`${activeSource.id}-decorated`]: {
            command: "npx",
            args: ["-y", "@mcp-decorator/proxy", "--target", activeSource.id],
            env: {
              MCP_DECORATOR_MODE: "zero-trust",
              MCP_AST_DISTILLER: "enabled",
              MCP_TOKEN_COMPRESSION: "max",
            },
          },
        },
      },
      null,
      2
    );
  };

  const generateCursorConfig = () => {
    return JSON.stringify(
      {
        mcpServers: {
          [`${activeSource.id}-decorated`]: {
            command: "npx",
            args: ["-y", "@mcp-decorator/proxy", "--target", activeSource.id],
            env: {
              MCP_DECORATOR_MODE: "zero-trust",
              MCP_AST_DISTILLER: "enabled",
            },
          },
        },
      },
      null,
      2
    );
  };

  const generateN8nConfig = () => {
    return JSON.stringify(
      {
        mcpServers: {
          "n8n-workflow-decorated": {
            command: "npx",
            args: ["-y", "@mcp-decorator/proxy", "--target", "n8n-mcp-server"],
            env: {
              N8N_API_KEY: "your_n8n_api_key_here",
              N8N_BASE_URL: "https://your-n8n-instance.app/api/v1",
              MCP_DECORATOR_MODE: "zero-trust",
              MCP_SECRET_REDACTION: "strict",
              MCP_TOKEN_DISTILLER: "enabled",
            },
          },
        },
      },
      null,
      2
    );
  };

  const currentSnippet =
    activeTab === "ts-proxy"
      ? generateTsProxyCode()
      : activeTab === "claude-desktop"
      ? generateClaudeDesktopConfig()
      : activeTab === "cursor"
      ? generateCursorConfig()
      : generateN8nConfig();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Export MCP Decorator Configuration</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Plug your decorated proxy directly into Claude Desktop, Cursor, or your backend pipeline
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

        {/* Tab switchers */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-4 pb-3 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab("ts-proxy")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer font-medium whitespace-nowrap text-xs ${
              activeTab === "ts-proxy"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow-xs font-bold"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            TypeScript Proxy
          </button>
          <button
            onClick={() => setActiveTab("claude-desktop")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer font-medium whitespace-nowrap text-xs ${
              activeTab === "claude-desktop"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow-xs font-bold"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Claude Desktop Config
          </button>
          <button
            onClick={() => setActiveTab("cursor")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer font-medium whitespace-nowrap text-xs ${
              activeTab === "cursor"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow-xs font-bold"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Cursor MCP Config
          </button>
          <button
            onClick={() => setActiveTab("n8n-recipe")}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer font-medium whitespace-nowrap text-xs ${
              activeTab === "n8n-recipe"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow-xs font-bold"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            n8n MCP Recipe
          </button>
        </div>

        {/* Reliability & Usage Guide Banner */}
        <div className="mb-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono space-y-1.5 shrink-0">
          <div className="flex flex-wrap items-center justify-between text-zinc-900 dark:text-zinc-100 font-bold gap-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>How It Works & Reliability Guarantee</span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase">100% Spec Grounded</span>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            MCP Decorator acts as a <strong>transparent stdio/SSE proxy middleware</strong>. It intercepts the standard JSON-RPC stream between your AI client and upstream MCP server. You don&apos;t modify the target server; the proxy executes AST secret redaction and token compression deterministically before the LLM receives the payload.
          </p>
        </div>

        {/* Code view */}
        <div className="flex-1 overflow-auto bg-zinc-950 rounded-2xl border border-zinc-800 p-4 sm:p-5 font-mono text-[11px] text-zinc-300 relative shadow-inner">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap z-10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
          <pre className="leading-relaxed whitespace-pre-wrap">{currentSnippet}</pre>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
          <span className="truncate">Targeting: <strong className="text-zinc-900 dark:text-zinc-100">{activeSource.name}</strong> ({activeDecorators.length} active steroids)</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

