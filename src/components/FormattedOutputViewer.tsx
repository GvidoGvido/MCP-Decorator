import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  Code2,
  FileText,
  ListOrdered,
  Layers,
} from "lucide-react";

interface FormattedOutputViewerProps {
  content: string;
  className?: string;
  variant?: "primary" | "secondary" | "subtle";
}

interface ParsedBlock {
  type: "header" | "bullet" | "numbered" | "code" | "paragraph" | "callout" | "key_value";
  text: string;
  level?: number;
  number?: string;
  codeLang?: string;
  calloutType?: "security" | "success" | "warning" | "info";
  key?: string;
  val?: string;
}

/**
 * Formats LLM / Agent text into clean, structured UI components
 * without raw markdown syntax bleed (no raw '#', '**', '```', or '-').
 */
export const FormattedOutputViewer: React.FC<FormattedOutputViewerProps> = ({
  content,
  className = "",
  variant = "primary",
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const cleanText = (raw: string): string => {
    return raw
      .replace(/\*\*(.*?)\*\*/g, "$1") // strip bold asterisks
      .replace(/\*(.*?)\*/g, "$1") // strip italic asterisks
      .replace(/__(.*?)__/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      .replace(/`([^`]+)`/g, "$1") // inline code markers
      .trim();
  };

  const parsedBlocks = useMemo(() => {
    if (!content) return [];

    const lines = content.split("\n");
    const blocks: ParsedBlock[] = [];
    let inCode = false;
    let codeBuffer: string[] = [];
    let codeLang = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code fences
      if (trimmed.startsWith("```")) {
        if (inCode) {
          blocks.push({
            type: "code",
            text: codeBuffer.join("\n"),
            codeLang: codeLang || "json",
          });
          codeBuffer = [];
          inCode = false;
          codeLang = "";
        } else {
          inCode = true;
          codeLang = trimmed.replace(/^```/, "").trim() || "json";
        }
        continue;
      }

      if (inCode) {
        codeBuffer.push(line);
        continue;
      }

      if (!trimmed) {
        continue;
      }

      // Headers (# Title or ### Subtitle or [Title])
      if (trimmed.startsWith("###")) {
        blocks.push({
          type: "header",
          level: 3,
          text: cleanText(trimmed.replace(/^###\s*/, "")),
        });
      } else if (trimmed.startsWith("##")) {
        blocks.push({
          type: "header",
          level: 2,
          text: cleanText(trimmed.replace(/^##\s*/, "")),
        });
      } else if (trimmed.startsWith("#")) {
        blocks.push({
          type: "header",
          level: 1,
          text: cleanText(trimmed.replace(/^#\s*/, "")),
        });
      } else if (/^\[(.*?)\]$/.test(trimmed)) {
        // Tagged section like [Autonomous Consensus] or [Single Agent Baseline]
        blocks.push({
          type: "callout",
          text: cleanText(trimmed.slice(1, -1)),
          calloutType: trimmed.toLowerCase().includes("single") ? "warning" : "success",
        });
      } else if (/^(\d+)[\.\)]\s+(.*)/.test(trimmed)) {
        // Numbered list item: 1. or 1)
        const match = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
        if (match) {
          const num = match[1];
          const rawBody = match[2];
          // Check if it's Key: Value
          const kvMatch = rawBody.match(/^([^:]+):\s*(.*)/);
          if (kvMatch) {
            blocks.push({
              type: "key_value",
              key: cleanText(kvMatch[1]),
              val: cleanText(kvMatch[2]),
              number: num,
              text: cleanText(rawBody),
            });
          } else {
            blocks.push({
              type: "numbered",
              number: num,
              text: cleanText(rawBody),
            });
          }
        }
      } else if (/^[-*•]\s+(.*)/.test(trimmed)) {
        // Bullet list item
        const rawBody = trimmed.replace(/^[-*•]\s+/, "");
        const kvMatch = rawBody.match(/^([^:]+):\s*(.*)/);
        if (kvMatch) {
          blocks.push({
            type: "key_value",
            key: cleanText(kvMatch[1]),
            val: cleanText(kvMatch[2]),
            text: cleanText(rawBody),
          });
        } else {
          blocks.push({
            type: "bullet",
            text: cleanText(rawBody),
          });
        }
      } else {
        // Standard paragraph or key-value summary
        const kvMatch = trimmed.match(/^([^:]+):\s*(.*)/);
        if (kvMatch && kvMatch[1].length < 35 && !kvMatch[1].includes("http")) {
          blocks.push({
            type: "key_value",
            key: cleanText(kvMatch[1]),
            val: cleanText(kvMatch[2]),
            text: cleanText(trimmed),
          });
        } else {
          blocks.push({
            type: "paragraph",
            text: cleanText(trimmed),
          });
        }
      }
    }

    if (inCode && codeBuffer.length > 0) {
      blocks.push({
        type: "code",
        text: codeBuffer.join("\n"),
        codeLang: codeLang || "text",
      });
    }

    return blocks;
  }, [content]);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {parsedBlocks.map((block, idx) => {
        if (block.type === "callout") {
          return (
            <div
              key={idx}
              className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs font-mono font-semibold ${
                block.calloutType === "warning"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{block.text}</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider opacity-80">Verified Formatted</span>
            </div>
          );
        }

        if (block.type === "header") {
          return (
            <div key={idx} className="pt-2 pb-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-50 tracking-tight flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                <span>{block.text}</span>
              </h4>
            </div>
          );
        }

        if (block.type === "key_value") {
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70 text-xs flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5 min-w-0"
            >
              <div className="flex items-center space-x-1.5 text-zinc-900 dark:text-zinc-100 font-bold shrink-0 sm:max-w-[200px]">
                {block.number ? (
                  <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono flex items-center justify-center font-bold shrink-0">
                    {block.number}
                  </span>
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" />
                )}
                <span className="font-mono text-[11px] uppercase tracking-wider truncate">{block.key}</span>
              </div>
              <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal min-w-0 flex-1 break-words">
                {block.val}
              </div>
            </div>
          );
        }

        if (block.type === "numbered") {
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-xs flex items-start space-x-2.5 text-zinc-700 dark:text-zinc-300 min-w-0"
            >
              <span className="w-4 h-4 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[10px] font-mono flex items-center justify-center font-bold shrink-0 mt-0.5">
                {block.number}
              </span>
              <span className="leading-relaxed min-w-0 flex-1 break-words">{block.text}</span>
            </div>
          );
        }

        if (block.type === "bullet") {
          return (
            <div
              key={idx}
              className="px-3 py-2 rounded-xl bg-zinc-50/40 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 text-xs flex items-start space-x-2 text-zinc-700 dark:text-zinc-300 min-w-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
              <span className="leading-relaxed min-w-0 flex-1 break-words">{block.text}</span>
            </div>
          );
        }

        if (block.type === "code") {
          const codeId = `code-${idx}`;
          return (
            <div
              key={idx}
              className="relative rounded-2xl bg-zinc-950 border border-zinc-800 p-3.5 font-mono text-[11px] text-zinc-300 overflow-hidden shadow-inner my-2 min-w-0"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-[10px] text-zinc-500 font-mono gap-2">
                <span className="flex items-center space-x-1.5 min-w-0 truncate">
                  <Terminal className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span className="truncate">{block.codeLang}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeId, block.text)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center space-x-1.5 transition-colors cursor-pointer text-[10px] font-semibold whitespace-nowrap shrink-0"
                >
                  {copiedCodeId === codeId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words leading-relaxed text-zinc-200 max-h-[300px]">
                {block.text}
              </pre>
            </div>
          );
        }

        // Paragraph
        return (
          <p
            key={idx}
            className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal break-words"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
};
