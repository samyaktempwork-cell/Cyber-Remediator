import React, { useState } from "react";
import { Shield, Sun, Moon, Lock, CheckCircle, Search, Smartphone, Globe, Terminal } from "lucide-react";
import { APP_NAME, BRAND_TAGLINE } from "../constants";
import { ScanInput, Theme, ScanInputType } from "../types";

interface LandingPageProps {
  onScan: (input: ScanInput) => void;
  // We'll add auth props later in Stage 3
  theme?: Theme;
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onScan, theme = 'dark', onToggleTheme }) => {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<ScanInputType>("EMAIL");

  const handleScan = () => {
    if (input.trim()) {
      onScan({ type: activeTab, value: input });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-[128px]"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center text-center space-y-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in-down">
          <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            {APP_NAME}
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl font-light">
          {BRAND_TAGLINE}
        </p>

        {/* Interactive Scanner Card */}
        <div className="w-full max-w-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-3xl shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
            {(["EMAIL", "MOBILE", "SOCIAL"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === type
                    ? "bg-white dark:bg-slate-700 text-cyan-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {type === "EMAIL" && <Search className="w-4 h-4" />}
                {type === "MOBILE" && <Smartphone className="w-4 h-4" />}
                {type === "SOCIAL" && <Globe className="w-4 h-4" />}
                {type}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder={`Target ${activeTab.toLowerCase()} (e.g. user@corp.com)`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              className="flex-1 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono text-sm"
            />
            <button
              onClick={handleScan}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              SCAN
            </button>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="flex gap-6 text-sm text-slate-500 font-medium pt-8 opacity-60">
           <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Vercel Edge</span>
           <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Kestra Orchestration</span>
           <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> AI Powered</span>
        </div>
      </div>
    </div>
  );
};