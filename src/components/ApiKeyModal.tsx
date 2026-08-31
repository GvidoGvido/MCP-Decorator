import React, { useState } from "react";
import { Key, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2, X, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputVal, setInputVal] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/mcp/test-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": inputVal.trim(),
        },
        body: JSON.stringify({ apiKey: inputVal.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message: data.message || "Key connected successfully to Gemini 3.7 Flash!",
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "Failed to validate key with Gemini.",
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Network error while validating key.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputVal.trim());
    onClose();
  };

  const handleClear = () => {
    setInputVal("");
    onSaveApiKey("");
    setTestResult(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 overflow-hidden relative shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">Gemini API Key Configuration</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure your key for real-time live LLM & Swarm reasoning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase">
              Google Gemini API Key
            </label>
            <div className="relative flex items-center">
              <input
                id="input-gemini-api-key"
                type={showKey ? "text" : "password"}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 pr-20 text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-zinc-400 text-zinc-900 dark:text-zinc-100"
              />
              <div className="absolute right-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5 flex items-center justify-between">
              <span>Key is stored securely in your browser session/localStorage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-0.5 font-medium"
              >
                <span>Get a free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                testResult.success
                  ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="font-medium text-xs leading-relaxed">{testResult.message}</span>
            </div>
          )}

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-start space-x-2 text-[11px] text-zinc-600 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <span>
              If left blank, the app will utilize the default backend environment configuration or provide high-fidelity simulated agent telemetry.
            </span>
          </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2.5 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold cursor-pointer transition-colors text-center sm:text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Clear Key
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-2xs"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
              <span>Test Connection</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              Save & Apply Key
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
};
