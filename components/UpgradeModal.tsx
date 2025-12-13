import React from "react";
import { Lock, Check, X } from "lucide-react";
import { Tier } from "../types";

export const UpgradeModal = ({ onClose, onUpgrade }: { onClose: () => void, onUpgrade: (tier: Tier) => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-float">
        
        {/* Header/Close (Mobile) */}
        <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-slate-500 z-10">
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar / Info */}
        <div className="bg-slate-100 dark:bg-slate-950 p-8 md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
               <div className="p-2 bg-cyan-500/10 rounded-lg">
                 <Lock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
               </div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Upgrade Required</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Automated remediation and advanced agent capabilities are restricted to Pro and Premium accounts.
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs">
              Secure your digital footprint with our automated Kestra workflows and dedicated security agents.
            </p>
          </div>
          <div className="mt-8">
            <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline">
              {/* FIXED: Escaped Apostrophe */}
              No thanks, I&apos;ll fix it manually
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-8 md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PRO PLAN */}
          <div className="border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-xl p-6 relative hover:border-cyan-500 transition-colors">
            <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
              RECOMMENDED
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">PRO AGENT</h3>
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">$29<span className="text-sm text-slate-500 font-normal">/mo</span></div>
            <ul className="text-sm space-y-3 mb-6 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Kestra Auto-Remediation</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Real-time Email Alerts</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-cyan-500" /> Priority Gemini Processing</li>
            </ul>
            <button 
              onClick={() => onUpgrade("PRO")}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 transition-all"
            >
              UPGRADE TO PRO
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 bg-white dark:bg-slate-900 rounded-xl p-6 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">ENTERPRISE</h3>
            <div className="text-2xl font-bold text-amber-500 mb-4">$99<span className="text-sm text-slate-500 font-normal">/mo</span></div>
            <ul className="text-sm space-y-3 mb-6 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2"><Check className="w-4 h-4 text-amber-500" /> Everything in Pro</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-amber-500" /> Dedicated Oumi Agents</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-amber-500" /> Multi-User Dashboard</li>
            </ul>
            <button 
              onClick={() => onUpgrade("PREMIUM")}
              className="w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
            >
              GO ENTERPRISE
            </button>
          </div>
        </div>
        
        {/* Close Button Desktop */}
        <button onClick={onClose} className="absolute top-4 right-4 hidden md:block text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};