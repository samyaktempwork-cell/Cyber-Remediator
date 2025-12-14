import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface ConsentGuardProps {
  onConfirm: () => void;
  onCancel: () => void;
  // NEW: Accept the login function so we can actually log the user in
  onLogin: (email: string) => void; 
  targetIdentity: string;
}

export const ConsentGuard: React.FC<ConsentGuardProps> = ({ onConfirm, onCancel, onLogin, targetIdentity }) => {
  const [emailInput, setEmailInput] = useState(targetIdentity || "");
  const [error, setError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // WHITELIST - These emails are allowed to enter Real Mode
  const AUTHORIZED_USERS = [
    "samyaktempwork@gmail.com",
    "pro@aegis.com",
    "premium@aegis.com",
    "admin@cyber.com",
    "test@demo.com"
  ];

  const handleAuthorization = () => {
    setIsAuthorizing(true);
    setError("");

    // Normalize input to avoid case-sensitive errors
    const normalizedInput = emailInput.trim().toLowerCase();
    
    setTimeout(() => {
      if (AUTHORIZED_USERS.includes(normalizedInput)) {
        // SUCCESS: Log the user in AND confirm the mode switch
        onLogin(normalizedInput); 
        onConfirm();
      } else {
        // FAIL: Show error
        setError("Authorization Failed: Identity not found in Whitelist.");
        setIsAuthorizing(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
        
        <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-100 dark:border-slate-800 text-center">
           <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
             <Shield className="w-6 h-6 text-rose-600 dark:text-rose-500" />
           </div>
           <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Real Mode Access</h2>
        </div>

        <div className="p-6 space-y-6">
           <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                 <strong className="font-bold">RESTRICTED ACCESS:</strong> Real Mode connects to live APIs. Enter an authorized email (e.g., <strong>samyaktempwork@gmail.com</strong>) to unlock.
              </p>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Authorized Identity</label>
              <div className="relative">
                 <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                 <input 
                   type="email" 
                   value={emailInput}
                   onChange={(e) => setEmailInput(e.target.value)}
                   placeholder="Enter authorized email..."
                   className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                 />
              </div>
              {error && <p className="text-xs text-rose-500 mt-2 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {error}</p>}
           </div>

           <button 
             onClick={handleAuthorization}
             disabled={isAuthorizing}
             className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
           >
             {isAuthorizing ? "Verifying..." : "UNLOCK REAL MODE"}
           </button>

           <button onClick={onCancel} className="w-full text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors">
             Cancel and return to simulation
           </button>
        </div>

      </div>
    </div>
  );
};