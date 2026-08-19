import React from "react";
import { Decorator, DecoratorCategory } from "../types";
import {
  Shield,
  Zap,
  Sparkles,
  Database,
  Terminal,
  Activity,
  Sliders,
  Flame,
} from "lucide-react";

interface DecoratorPipelineBuilderProps {
  decorators: Decorator[];
  onToggleDecorator: (decoratorId: string) => void;
  onToggleAll: (enable: boolean) => void;
}

export const DecoratorPipelineBuilder: React.FC<DecoratorPipelineBuilderProps> = ({
  decorators,
  onToggleDecorator,
  onToggleAll,
}) => {
  const getCategoryIcon = (category: DecoratorCategory) => {
    switch (category) {
      case "security":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "compression":
        return <Zap className="w-4 h-4 text-amber-500" />;
      case "domain":
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case "resilience":
        return <Activity className="w-4 h-4 text-blue-600" />;
      case "sandbox":
        return <Terminal className="w-4 h-4 text-slate-700" />;
      case "prompt":
        return <Sliders className="w-4 h-4 text-purple-600" />;
    }
  };

  const activeCount = decorators.filter((d) => d.enabled).length;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            2. Decorators (Steroids Pipeline)
          </h2>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
            {activeCount}/{decorators.length} ACTIVE
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            id="btn-enable-all-steroids"
            onClick={() => onToggleAll(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold text-[11px] transition-colors cursor-pointer"
          >
            ENABLE ALL
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            id="btn-disable-all-steroids"
            onClick={() => onToggleAll(false)}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 font-bold text-[11px] transition-colors cursor-pointer"
          >
            DISABLE ALL
          </button>
        </div>
      </div>

      {/* Decorators Stack with Clean Minimalism Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {decorators.map((dec) => {
          return (
            <div
              key={dec.id}
              id={`decorator-card-${dec.id}`}
              onClick={() => onToggleDecorator(dec.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden flex flex-col justify-between ${
                dec.enabled
                  ? "bg-white/90 dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-800 shadow-xs ring-1 ring-indigo-500/10 dark:ring-indigo-400/20"
                  : "bg-white/40 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/50 opacity-60 hover:opacity-80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg border ${dec.enabled ? "bg-indigo-50/70 dark:bg-indigo-950/70 border-indigo-100 dark:border-indigo-800" : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600"}`}>
                      {getCategoryIcon(dec.category)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{dec.name}</h3>
                      <span className="text-[9px] font-mono uppercase text-slate-400 dark:text-slate-500 font-medium tracking-wider">
                        {dec.category}
                      </span>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <div
                    className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      dec.enabled ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-2xs ${
                        dec.enabled ? "translate-x-3.5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {dec.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-700/60 text-[10px] font-medium">
                {dec.badge ? (
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                    dec.category === "security"
                      ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800"
                      : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                  }`}>
                    {dec.badge}
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">Standard</span>
                )}
                <span className={`font-mono text-[10px] ${dec.enabled ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
                  {dec.enabled ? "INTERCEPTING" : "BYPASSED"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

