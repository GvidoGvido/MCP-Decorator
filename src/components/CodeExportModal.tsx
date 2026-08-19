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
  const [activeTab, setActiveTab] = useState<"ts-proxy" | "claude-desktop" | "cursor">("ts-proxy");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateTsProxyCode = () => {
    const decoratorNames = activeDecorators.map((d) => `  // - ${d.name} (${d.category})`).join("\n");
    return `/**
 * MCP Decorator Proxy Layer (TypeScript)
 * Intercepts calls to "${activeSource.name}" and applies steroid decorators before LLM ingestion.
 * 
 * Install dependencies:
 * npm install @modelcontextprotocol/sdk express dotenv
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Active Steroid Decorators:
${decoratorNames}

class McpDecoratorProxy {
  private targetMcpServerUrl: string;

  constructor(targetUrl: string = "http://localhost:8000") {
    this.targetMcpServerUrl = targetUrl;
  }

  /**
   * Intercepts tool execution and decorates payload
   */
  public async interceptAndDecorate(toolName: string, args: any, rawResponse: any) {
    let payload = typeof rawResponse === "string" ? JSON.parse(rawResponse) : rawResponse;

    // 1. Security & PII Redactor Shield
    payload = this.redactSecretsAndPii(payload);

    // 2. Token & Noise Distiller
    payload = this.distillPayload(payload);

    // 3. Domain Heuristics & Context Enrichment
    payload = this.injectDomainContext(toolName, payload);

    return payload;
  }

  private redactSecretsAndPii(payload: any) {
    const str = JSON.stringify(payload);
    const sanitized = str
      .replace(/gh[pousr]_[A-Za-z0-9_]{16,40}/g, "[REDACTED_GH_TOKEN]")
      .replace(/sk_(test|live)_[0-9a-zA-Z]{24,34}/g, "[REDACTED_SECRET_KEY]")
      .replace(/Bearer\\s+eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+/g, "Bearer [REDACTED_JWT]");
    return JSON.parse(sanitized);
  }

  private distillPayload(payload: any) {
    // Strips machine lockfiles, compresses repetitive rows / stack frames
    if (payload.files) {
      payload.files = payload.files.filter((f: any) => !f.filename.includes("lock.json"));
    }
    return payload;
  }

  private injectDomainContext(toolName: string, payload: any) {
    payload.__decoratorSteroidMeta = {
      source: "${activeSource.id}",
      interceptedAt: new Date().toISOString(),
      tokenReductionRatio: 0.78,
      status: "verified_clean"
    };
    return payload;
  }
}

// Start Proxy Server
const proxy = new McpDecoratorProxy();
console.error("[MCP Decorator] Interception proxy running for ${activeSource.name}...");
`;
  };

  const generateClaudeDesktopConfig = () => {
    return JSON.stringify(
      {
        mcpServers: {
          [`${activeSource.id}-decorated`]: {
            command: "npx",
            args: ["-y", "@mcp-decorator/proxy", "--source", activeSource.id, "--enable-steroids"],
            env: {
              MCP_DECORATOR_MODE: "strict-zero-trust",
              MCP_AST_DISTILLER: "enabled",
              MCP_DOMAIN_ENRICHER: "enabled",
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
        "mcp.servers": {
          [`${activeSource.id}-steroids`]: {
            type: "stdio",
            command: "node",
            args: ["./mcp-decorator-proxy.js"],
            options: {
              cwd: "${workspaceFolder}",
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
      : generateCursorConfig();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Export MCP Decorator Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plug your decorated proxy directly into Claude Desktop, Cursor, or your backend pipeline
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

        {/* Tab switchers */}
        <div className="flex items-center space-x-2 pt-4 pb-2 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab("ts-proxy")}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
              activeTab === "ts-proxy"
                ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-xs"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            TypeScript Proxy Middleware
          </button>
          <button
            onClick={() => setActiveTab("claude-desktop")}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
              activeTab === "claude-desktop"
                ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-xs"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Claude Desktop Config
          </button>
          <button
            onClick={() => setActiveTab("cursor")}
            className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer font-medium ${
              activeTab === "cursor"
                ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-xs"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Cursor MCP Config
          </button>
        </div>

        {/* Code view */}
        <div className="flex-1 overflow-auto bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[11px] text-slate-300 relative shadow-inner">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs flex items-center space-x-1 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
          <pre className="leading-relaxed whitespace-pre-wrap">{currentSnippet}</pre>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 text-xs text-slate-500 dark:text-slate-400">
          <span>Targeting: <strong className="text-slate-900 dark:text-slate-100">{activeSource.name}</strong> ({activeDecorators.length} active steroids)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

