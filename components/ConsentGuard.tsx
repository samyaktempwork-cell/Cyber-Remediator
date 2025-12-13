import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

interface ConsentGuardProps {
  onConsentChange: (consented: boolean) => void;
  // Fix: explicitly allow children as optional ReactNode to solve TS build errors in some environments
  children?: React.ReactNode;
}

export const ConsentGuard = ({ children, onConsentChange }: ConsentGuardProps) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentBox, setShowConsentBox] = useState(true);

  const handleToggle = () => {
    const newState = !hasConsented;
    setHasConsented(newState);
    onConsentChange(newState);
  };

  return (
    <div className="w-full">
      {showConsentBox && (
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">Legal Authorization Required</h4>
              <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80 leading-relaxed">
                I authorize Aegis Vizier to perform advanced scanning and remediation on my own identity. I understand that automated remediation (Pro/Premium) may alter my security configurations or interact with third-party services on my behalf.
              </p>
            </div>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div 
              onClick={handleToggle}
              className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${hasConsented ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${hasConsented ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${hasConsented ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              {hasConsented ? "Authorization Granted" : "Authorize Remediation"}
            </span>
          </label>
        </div>
      )}
      
      <div className={!hasConsented ? "opacity-50 pointer-events-none grayscale" : ""}>
        {children}
      </div>
    </div>
  );
};
