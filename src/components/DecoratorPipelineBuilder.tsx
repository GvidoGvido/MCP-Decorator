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
        return <Shield className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "compression":
        return <Zap className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "domain":
        return <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "resilience":
        return <Activity className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "sandbox":
        return <Terminal className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case "prompt":
        return <Sliders className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
    }
  };

  const activeCount = decorators.filter((d) => d.enabled).length;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-7 space-y-5 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
            2. Decorator Pipeline (Steroids Engine)
          </h2>
          <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs whitespace-nowrap">
            {activeCount}/{decorators.length} ACTIVE
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            id="btn-enable-all-steroids"
            onClick={() => onToggleAll(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap border border-zinc-200 dark:border-zinc-700"
          >
            ENABLE ALL
          </button>
          <button
            id="btn-disable-all-steroids"
            onClick={() => onToggleAll(false)}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap border border-zinc-200 dark:border-zinc-700"
          >
            DISABLE ALL
          </button>
        </div>
      </div>

      {/* Decorators Stack with Clean Minimalism Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {decorators.map((dec) => {
          return (
            <div
              key={dec.id}
              id={`decorator-card-${dec.id}`}
              onClick={() => onToggleDecorator(dec.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none relative overflow-hidden flex flex-col justify-between ${
                dec.enabled
                  ? "bg-zinc-50 dark:bg-zinc-800/80 border-zinc-900 dark:border-zinc-100 shadow-xs ring-1 ring-zinc-900/10 dark:ring-zinc-100/10"
                  : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-85"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl border ${dec.enabled ? "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"}`}>
                      {getCategoryIcon(dec.category)}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{dec.name}</h3>
                      <span className="text-[9px] font-mono uppercase text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider">
                        {dec.category}
                      </span>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <div
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      dec.enabled ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform shadow-xs ${
                        dec.enabled ? "translate-x-4 bg-white dark:bg-zinc-900" : "translate-x-0 bg-white"
                      }`}
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3.5">
                  {dec.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-medium">
                {dec.badge ? (
                  <span className="px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                    {dec.badge}
                  </span>
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500 whitespace-nowrap">Standard</span>
                )}
                <span className={`font-mono text-[10px] whitespace-nowrap ${dec.enabled ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-zinc-400 dark:text-zinc-500"}`}>
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

