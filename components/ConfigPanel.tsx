
import React, { useContext } from "react";
import { Settings, Code, Check, Lock, Key, Workflow, Box, LayoutTemplate, Server, LogOut, CreditCard, Activity, Globe } from "lucide-react";
import { Tier, AppMode } from "../types";
import { CodeBlock } from "./CodeBlock";
import { KESTRA_YAML, DOCKER_COMPOSE, CLINE_PROMPT, VERCEL_JSON } from "../constants";
import { ModeContext } from "./AppModeContext";

interface ConfigPanelProps {
  configTab: "SETTINGS" | "BLUEPRINTS";
  setConfigTab: (t: "SETTINGS" | "BLUEPRINTS") => void;
  tier: Tier;
  userLicenseTier: Tier;
  onTierSwitchRequest: (tier: Tier) => void;
  blueprintCategory: "KESTRA" | "DOCKER" | "CLINE" | "VERCEL";
  setBlueprintCategory: (v: any) => void;
  setAppMode: (m: AppMode) => void;
  onLogout: () => void;
}

export const ConfigPanel = ({ 
  configTab, setConfigTab, tier, userLicenseTier, onTierSwitchRequest,
  blueprintCategory, setBlueprintCategory, setAppMode, onLogout
}: ConfigPanelProps) => {
  const { opMode, setOpMode } = useContext(ModeContext);
  const isFree = tier === 'FREE';

  return (
    <div className={`dashboard-card h-full flex flex-col overflow-hidden min-h-0 min-w-0 border-t-4 transition-colors duration-500 ${opMode === 'REAL' ? 'border-t-rose-500' : 'border-t-cyan-500'}`}>
        {/* Header Tabs */}
        <div className="card-header flex flex-row items-center justify-start gap-3 flex-nowrap min-w-0">
            <button 
                onClick={() => setConfigTab("SETTINGS")}
                className={`flex items-center gap-2 text-sm font-bold transition-colors whitespace-nowrap px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${configTab === "SETTINGS" ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
            >
                <Settings className="w-4 h-4 shrink-0" /> 
                <span>CONFIGURATION</span>
            </button>
            
            <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 shrink-0"></div>

            <button 
                onClick={() => !isFree && setConfigTab("BLUEPRINTS")}
                disabled={isFree}
                className={`flex items-center gap-2 text-sm font-bold transition-colors whitespace-nowrap px-3 py-1.5 rounded-md 
                ${configTab === "BLUEPRINTS" 
                    ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                    : isFree 
                        ? "text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70" 
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                title={isFree ? "Upgrade to Pro to access Blueprints" : "Infrastructure Blueprints"}
            >
                {isFree ? <Lock className="w-3 h-3 shrink-0" /> : <Code className="w-4 h-4 shrink-0" />}
                <span>BLUEPRINTS</span>
            </button>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 px-6 overflow-hidden flex flex-col min-h-0 pt-4">
        {configTab === "SETTINGS" ? (
            <div className="flex-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pb-4">
            
            {/* License Tier Details */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-800">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1">LICENSE TIER OVERVIEW</span>
                        <span className={`text-lg font-black ${
                            userLicenseTier === 'PREMIUM' ? 'text-amber-500' :
                            userLicenseTier === 'PRO' ? 'text-cyan-600 dark:text-cyan-400' :
                            'text-slate-700 dark:text-slate-200'
                        }`}>{userLicenseTier} LICENSE</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        userLicenseTier === 'FREE' ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500' :
                        'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    }`}>
                        {userLicenseTier === 'FREE' ? 'STANDARD' : 'ACTIVE'}
                    </div>
                </div>

                {/* Realm Mode Selector (Simulation vs Real) */}
                <div className="mb-4 bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Realm Selection
                    </div>
                    <div className="flex gap-2">
                        <button
                          onClick={() => setOpMode("SIMULATION")}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded border transition-all ${
                            opMode === "SIMULATION" 
                              ? 'bg-cyan-600 text-white border-transparent shadow-md' 
                              : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          SIMULATION
                        </button>
                        <button
                          disabled={isFree}
                          onClick={() => setOpMode("REAL")}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded border transition-all ${
                            opMode === "REAL" 
                              ? 'bg-rose-600 text-white border-transparent shadow-md' 
                              : isFree 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                          }`}
                        >
                          REAL MODE
                        </button>
                    </div>
                </div>

                {/* View/Simulation Switcher */}
                <div className="mb-4 bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                   <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Simulation View Tier
                   </div>
                   <div className="flex gap-2">
                      {(['FREE', 'PRO', 'PREMIUM'] as Tier[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => onTierSwitchRequest(t)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded border transition-colors ${
                            tier === t 
                              ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-sm' 
                              : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                </div>

                {/* API Status Info */}
                <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                        <Key className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">LLM Connection Status</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                           {tier === 'FREE' 
                             ? "Using System Key (Standard Limits)" 
                             : "Using System Key (Pro Limits)"}
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Active Entitlements</div>
                    <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400">
                        <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Threat Detection (8 Vectors)
                        </li>
                        <li className="flex items-center gap-2">
                            {tier === 'FREE' ? <Lock className="w-3.5 h-3.5 text-rose-500" /> : <Check className="w-3.5 h-3.5 text-emerald-500" />} 
                            Kestra Auto-Remediation
                        </li>
                        <li className="flex items-center gap-2">
                            {tier === 'PREMIUM' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />} 
                            Dedicated Oumi Agents
                        </li>
                    </ul>
                </div>
            </div>
            
            </div>
        ) : (
            // BLUEPRINTS TAB
            isFree ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-60">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                        <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-600 dark:text-slate-400">Blueprints Restricted</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                        Infrastructure code generation is available on PRO and PREMIUM plans.
                    </p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Blueprint Navigation */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 shrink-0 scrollbar-none">
                        {[
                        { id: 'KESTRA', label: 'Kestra', icon: Workflow },
                        { id: 'DOCKER', label: 'Docker', icon: Box },
                        { id: 'CLINE', label: 'Cline', icon: LayoutTemplate },
                        { id: 'VERCEL', label: 'Vercel', icon: Server },
                        ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setBlueprintCategory(item.id as any)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-bold whitespace-nowrap border transition-all ${
                            blueprintCategory === item.id 
                            ? 'bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border-slate-300 dark:border-slate-600'
                            : 'bg-transparent text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <item.icon className="w-3 h-3" /> {item.label}
                        </button>
                        ))}
                    </div>

                    {/* Code Display */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        {blueprintCategory === "KESTRA" && (
                        <CodeBlock label="flow.yaml" code={KESTRA_YAML} language="yaml" />
                        )}
                        {blueprintCategory === "DOCKER" && (
                        <CodeBlock label="docker-compose.yml" code={DOCKER_COMPOSE} language="yaml" />
                        )}
                        {blueprintCategory === "CLINE" && (
                        <CodeBlock label="cline_prompt.txt" code={CLINE_PROMPT} language="text" />
                        )}
                        {blueprintCategory === "VERCEL" && (
                        <CodeBlock label="vercel.json" code={VERCEL_JSON} language="json" />
                        )}
                    </div>
                    
                    <p className="mt-2 text-[10px] text-slate-500 text-center shrink-0">
                        Copy these blueprints to deploy the backend infrastructure.
                    </p>
                </div>
            )
        )}
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-500 shrink-0 px-6 pb-4">
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-rose-500 hover:text-rose-600 dark:text-rose-500 dark:hover:text-rose-400 transition-colors font-bold"
            >
                <LogOut className="w-3 h-3" /> LOGOUT
            </button>
            <div className="flex gap-2">
                <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${opMode === 'REAL' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span>Systems Operational</span>
            </div>
        </div>
    </div>
  );
};
