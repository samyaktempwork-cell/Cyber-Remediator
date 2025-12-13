import React, { useRef, useEffect, useState } from "react";
import { Terminal, Lock, Workflow, Check, Zap, Server, Code } from "lucide-react";
import { LogEntry, Tier } from "../types";
import { ConsentGuard } from "./ConsentGuard";

interface RemediationConsoleProps {
  logs: LogEntry[];
  triggerRemediation: () => void;
  isRemediating: boolean;
  riskScore: number;
  tier: Tier;
}

export const RemediationConsole = ({ logs, triggerRemediation, isRemediating, riskScore, tier }: RemediationConsoleProps) => {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => { 
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [logs]);

  return (
    <div className="dashboard-card h-full w-full flex flex-col font-mono overflow-hidden border-t-4 border-t-emerald-500">
      
      {/* HEADER */}
      <div className="card-header shrink-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
                <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> 
                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    KESTRA <span className="text-slate-400 mx-1">/</span> CLINE AI BRIDGE
                </h3>
            </div>
            
            <div className="flex gap-2 shrink-0">
                <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <Code className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">CLINE ENABLED</span>
                </div>
                <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <Workflow className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">v0.17</span>
                </div>
                <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <Server className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Vercel</span>
                </div>
            </div>
      </div>

      {/* LOGS AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 text-xs bg-slate-50 dark:bg-black/50 p-3 mx-4 mt-4 mb-2 rounded border border-slate-200 dark:border-slate-800 shadow-inner min-h-0">
        {logs.length === 0 && (
            <div className="text-slate-400 dark:text-slate-600 italic opacity-50 text-center mt-10">
                Waiting for Kestra execution stream...
            </div>
        )}
        {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 font-mono leading-relaxed">
                <span className="text-slate-400 dark:text-slate-600 shrink-0">[{log.timestamp}]</span>
                <span className={`break-words ${
                    log.type === 'error' ? 'text-rose-600 dark:text-rose-500 font-bold' : 
                    log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-600 dark:text-amber-400' : 
                    'text-slate-700 dark:text-slate-300'
                }`}>
                    {log.type === 'info' ? '>' : '#'} {log.message}
                </span>
            </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* ACTION FOOTER */}
      <div className="p-4 pt-2 shrink-0">
        <ConsentGuard onConsentChange={setIsAuthorized}>
            <button 
                onClick={triggerRemediation}
                disabled={isRemediating || riskScore < 20 || !isAuthorized}
                className={`w-full py-3 rounded-lg border font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg text-xs sm:text-sm
                    ${tier === 'FREE' 
                    ? 'border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-500'
                    : riskScore < 20
                        ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 cursor-default'
                        : 'border-rose-500 text-white bg-rose-600 hover:bg-rose-500 hover:shadow-rose-500/40'
                    }`}
            >
                {tier === 'FREE' ? (
                    <><Lock className="w-4 h-4" /> UPGRADE TO PRO TO REMEDIATE</>
                ) : isRemediating ? (
                    <><Workflow className="w-4 h-4 animate-spin" /> EXECUTING WORKFLOW...</>
                ) : riskScore < 20 ? (
                    <><Check className="w-4 h-4" /> SYSTEM SECURED</>
                ) : (
                    <><Zap className="w-4 h-4" /> EXECUTE REMEDIATION</>
                )}
            </button>
        </ConsentGuard>
      </div>
    </div>
  );
};