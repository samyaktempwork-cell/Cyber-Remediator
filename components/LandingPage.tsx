
import React, { useState, useContext } from "react";
import { LogIn, ArrowRight, Sun, Moon, Scan, Search, User, Cpu, Server, Workflow, Zap, Code, Layers, Shield, AlertCircle, AlertTriangle, KeyRound, CheckCircle, Smartphone, AtSign, Mail, Globe, Beaker, Lock, Database } from "lucide-react";
import { Theme, ScanInput } from "../types";
import { AuthService } from "../services/authService";
import { APP_NAME, BRAND_TAGLINE } from "../constants";
import { ModeContext } from "./AppModeContext";

export const LandingPage = ({ 
  onScan, 
  onLogin, 
  authError, 
  setAuthError, 
  theme, 
  onToggleTheme 
}: { 
  onScan: (input: ScanInput) => void, 
  onLogin: (email: string, password?: string) => void, 
  authError?: string, 
  setAuthError?: (error: string) => void,
  theme: Theme, 
  onToggleTheme: () => void 
}) => {
  const { opMode, setOpMode } = useContext(ModeContext);
  const [identity, setIdentity] = useState("");
  const [view, setView] = useState<"SCAN" | "LOGIN" | "FORGOT">("SCAN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [demoKey, setDemoKey] = useState("");
  const [demoKeyError, setDemoKeyError] = useState("");

  const [inputType, setInputType] = useState<"EMAIL" | "MOBILE" | "SOCIAL">("EMAIL");
  const [validationError, setValidationError] = useState("");
  
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [resetMessage, setResetMessage] = useState("");

  const techStack = [
    { name: "Next.js 14", icon: Server, color: "text-slate-900 dark:text-white" },
    { name: "Vercel Edge", icon: Zap, color: "text-black dark:text-white" },
    { name: "Gemini 2.5", icon: Cpu, color: "text-blue-500" },
    { name: "Kestra", icon: Workflow, color: "text-purple-500" },
    { name: "Cline AI", icon: Code, color: "text-emerald-500" },
    { name: "AWS IAM", icon: Database, color: "text-orange-500" },
    { name: "Google OSINT", icon: Globe, color: "text-red-500" },
    { name: "Tailwind", icon: Layers, color: "text-cyan-500" },
  ];

  const validateInput = (value: string, type: "EMAIL" | "MOBILE" | "SOCIAL") => {
    if (!value) return "";
    switch(type) {
        case "EMAIL":
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format (e.g. user@domain.com)";
        case "MOBILE":
            return /^\+?[0-9\s-]{10,15}$/.test(value) ? "" : "Invalid phone format (min 10 digits)";
        case "SOCIAL":
            return /^@?[a-zA-Z0-9_]{3,30}$/.test(value) ? "" : "Invalid handle (3-30 chars, alphanumeric)";
        default:
            return "";
    }
  };

  const handleIdentityChange = (val: string) => {
      setIdentity(val);
      setValidationError(validateInput(val, inputType));
  };

  const handleInputTypeChange = (type: "EMAIL" | "MOBILE" | "SOCIAL") => {
      setInputType(type);
      setIdentity("");
      setValidationError("");
  };

  const handleResetPassword = async () => {
      if (!resetEmail) return;
      setResetStatus("LOADING");
      const result = await AuthService.requestPasswordReset(resetEmail);
      if (result.success) {
          setResetStatus("SUCCESS");
          setResetMessage(result.message);
      } else {
          setResetStatus("ERROR");
          setResetMessage(result.message);
      }
  };

  const handleRealModeUnlock = () => {
      if (AuthService.verifyDemoKey(demoKey)) {
          const authorizedEmail = "samyaktempwork@gmail.com";
          // Ensure REAL mode is selected when unlocking
          setOpMode("REAL");
          onLogin(authorizedEmail, "aegis@123");
      } else {
          setDemoKeyError("Unauthorized Identity. Access is restricted to System Administrators.");
      }
  };

  const getInputIcon = () => {
      switch(inputType) {
          case "EMAIL": return Mail;
          case "MOBILE": return Smartphone;
          case "SOCIAL": return AtSign;
          default: return Search;
      }
  };

  const InputIcon = getInputIcon();

  const appNameParts = APP_NAME.split(' ');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300 font-sans">
      
      {/* --- BRANDED HEADER --- */}
      <div className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shadow-lg transition-colors duration-500 ${opMode === 'REAL' ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'}`}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-slate-800 dark:text-slate-100 uppercase">
                {appNameParts[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-colors duration-500 ${opMode === 'REAL' ? 'from-rose-500 to-red-500' : 'from-cyan-500 to-blue-500'}`}>{appNameParts[1]}</span>
              </h1>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-inner">
                <button 
                  onClick={() => setOpMode("SIMULATION")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1.5 ${opMode === 'SIMULATION' ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Beaker className="w-3 h-3" /> SIMULATION
                </button>
                <button 
                  onClick={() => setOpMode("REAL")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all flex items-center gap-1.5 ${opMode === 'REAL' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  <Globe className="w-3 h-3" /> REAL MODE
                </button>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            <button 
                onClick={onToggleTheme}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
            onClick={() => setView(view === 'SCAN' ? 'LOGIN' : 'SCAN')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 transition-all font-bold text-xs shadow-lg"
            >
            {view === 'SCAN' ? (
                <><LogIn className="w-3 h-3" /> MEMBER ACCESS</>
            ) : (
                <><ArrowRight className="w-3 h-3 rotate-180" /> PUBLIC SCAN</>
            )}
            </button>
        </div>
      </div>

      <div className={`absolute inset-0 transition-colors duration-700 ${
        opMode === 'REAL' 
        ? (theme === 'dark' ? 'bg-rose-950/20' : 'bg-rose-50/50')
        : (theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50')
      }`}>
        <div className={`absolute inset-0 ${theme === 'dark' 
          ? `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${opMode === 'REAL' ? 'from-rose-900/10' : 'from-indigo-900/20'} via-slate-950 to-slate-950` 
          : `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${opMode === 'REAL' ? 'from-rose-100/50' : 'from-indigo-100/50'} via-slate-50 to-slate-50`}`} 
        />
      </div>

      {/* --- BACKGROUND MEGATExt --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
         <h1 className={`text-[9vw] font-black leading-none whitespace-nowrap tracking-tighter blur-[1px] transition-all duration-500 uppercase ${opMode === 'REAL' ? 'text-rose-900/10 dark:text-rose-100/10' : 'text-cyan-900/10 dark:text-cyan-100/10'}`}>
            {APP_NAME}
         </h1>
      </div>
      
      <div className="z-10 w-full max-w-md p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 mb-24 animate-float">
        
        {opMode === "REAL" && view === "SCAN" ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                        <Globe className="w-8 h-8 text-rose-600" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-black text-center text-slate-800 dark:text-slate-100 mb-4 tracking-tight uppercase italic">
                    REAL MODE ACCESS
                </h1>

                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 mb-6">
                    <div className="flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium leading-relaxed text-rose-800 dark:text-rose-300">
                            ELEVATED CLEARANCE REQUIRED: Live API integration is strictly regulated to prevent infrastructure disruption. Real Mode remediation protocols are only available to authorized identities with Enterprise credentials. System Administrators have whitelisted specific identities for live demonstration purposes.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-rose-400 group-focus-within:text-rose-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none sm:text-sm transition-all shadow-inner ${demoKeyError ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-rose-500'}`}
                            placeholder="Enter Authorized Email or Admin Key"
                            value={demoKey}
                            onChange={(e) => { setDemoKey(e.target.value); setDemoKeyError(""); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleRealModeUnlock()}
                        />
                    </div>

                    {demoKeyError && (
                        <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1.5 px-1">
                            <AlertCircle className="w-3 h-3" /> {demoKeyError}
                        </p>
                    )}

                    <button
                        onClick={handleRealModeUnlock}
                        disabled={!demoKey}
                        className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-sm font-black text-white transition-all ${demoKey ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/40 cursor-pointer transform hover:-translate-y-0.5' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                    >
                        REQUEST LIVE AUTHORIZATION
                    </button>

                    <button 
                        onClick={() => setOpMode("SIMULATION")}
                        className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        Cancel and return to simulation
                    </button>
                </div>
            </div>
        ) : (
            view === 'SCAN' && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <Scan className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-black text-center text-slate-800 dark:text-slate-100 mb-2 tracking-tight uppercase">
                  {APP_NAME}
                </h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-xs font-mono font-bold">
                  {BRAND_TAGLINE}
                </p>
    
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 shadow-inner">
                    {[
                        { id: 'EMAIL', label: 'Email', icon: Mail },
                        { id: 'MOBILE', label: 'Mobile', icon: Smartphone },
                        { id: 'SOCIAL', label: 'Social', icon: AtSign }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleInputTypeChange(type.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${
                                inputType === type.id 
                                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <type.icon className="w-3 h-3" />
                            {type.label}
                        </button>
                    ))}
                </div>
    
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <InputIcon className={`h-5 w-5 ${validationError ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'} group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors`} />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg leading-5 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 sm:text-sm transition-all shadow-inner backdrop-blur-sm ${
                          validationError 
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' 
                          : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
                      }`}
                      placeholder={
                          inputType === 'EMAIL' ? "name@company.com" : 
                          inputType === 'MOBILE' ? "+1 555 000 0000" : 
                          "@username"
                      }
                      value={identity}
                      onChange={(e) => handleIdentityChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && identity && !validationError && onScan({ type: inputType, value: identity })}
                    />
                  </div>
                  
                  {validationError && (
                      <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold px-1 animate-in slide-in-from-top-1 fade-in">
                          <AlertCircle className="w-3 h-3" /> {validationError}
                      </div>
                  )}
    
                  <button
                    onClick={() => identity && !validationError && onScan({ type: inputType, value: identity })}
                    disabled={!identity || !!validationError}
                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white transition-all
                      ${identity && !validationError
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg cursor-pointer transform hover:-translate-y-0.5' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                  >
                     INITIATE DEEP SCAN
                  </button>
                </div>
              </>
            )
        )}

        {view === 'LOGIN' && (
          <>
             <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2 tracking-tight uppercase">
              MEMBER LOGIN
            </h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-xs font-mono font-bold">
              Secure Auth Gateway
            </p>

            <div className="space-y-4">
              <input
                  type="email"
                  className={`block w-full px-3 py-3 border rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none sm:text-sm transition-colors ${
                    authError 
                    ? 'border-rose-500 focus:border-rose-600' 
                    : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500'
                  }`}
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <input
                  type="password"
                  className={`block w-full px-3 py-3 border rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none sm:text-sm transition-colors ${
                    authError 
                    ? 'border-rose-500 focus:border-rose-600' 
                    : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500'
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && email && onLogin(email, password)}
              />

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                </div>
              )}

              <button
                onClick={() => email && onLogin(email, password)}
                disabled={!email}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white transition-all
                  ${email 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg cursor-pointer' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
              >
                 SECURE CONNECTION
              </button>
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-3">
               <button 
                 onClick={() => { setView('FORGOT'); if (setAuthError) setAuthError(""); }}
                 className="text-xs text-slate-400 hover:text-cyan-500 cursor-pointer transition-colors"
               >
                 Forgot Credentials?
               </button>
               
               <div className="w-full border-t border-slate-200 dark:border-slate-800 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/60 dark:bg-slate-900/60 px-2 text-[10px] text-slate-400">OR</span>
               </div>

               <button 
                 onClick={() => setView('SCAN')}
                 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors flex items-center gap-1"
               >
                 <ArrowRight className="w-3 h-3 rotate-180" /> Use Public Scanner (Free)
               </button>
            </div>
          </>
        )}

        {view === 'FORGOT' && (
            <>
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                        <KeyRound className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2 tracking-tight uppercase">
                    RECOVERY MODE
                </h1>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-xs font-mono font-bold">
                    Reset Access Credentials
                </p>

                {resetStatus === 'SUCCESS' ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">Recovery Link Sent</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 mb-4">
                            {resetMessage}
                        </p>
                        <button 
                            onClick={() => { setView('LOGIN'); setResetStatus('IDLE'); }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input
                            type="email"
                            className="block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all shadow-inner"
                            placeholder="Enter Registered Email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                        />

                        {resetStatus === 'ERROR' && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{resetMessage}</span>
                            </div>
                        )}

                        <button
                            onClick={handleResetPassword}
                            disabled={!resetEmail || resetStatus === 'LOADING'}
                            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white transition-all
                            ${resetEmail && resetStatus !== 'LOADING'
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg cursor-pointer' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                        >
                            {resetStatus === 'LOADING' ? 'VERIFYING...' : 'SEND RESET LINK'}
                        </button>

                        <div className="mt-4 text-center">
                            <button 
                                onClick={() => setView('LOGIN')}
                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>

      {/* --- REFINED FOOTER --- */}
      <footer className="absolute bottom-0 w-full bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 py-4 px-8 z-20 transition-all duration-300">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left: Stack Information */}
            <div className="flex-1 flex items-center gap-4 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none scroll-smooth">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap shrink-0 border-r border-slate-300 dark:border-slate-800 pr-4 mr-1">
                  Integrated Stack
                </span>
                <div className="flex items-center gap-3">
                  {techStack.map((tech) => (
                      <div key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 transition-all hover:scale-105 hover:border-slate-400 dark:hover:border-slate-600 group">
                          <tech.icon className={`w-3.5 h-3.5 ${tech.color} group-hover:animate-pulse`} />
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{tech.name}</span>
                      </div>
                  ))}
                </div>
            </div>

            {/* Right: Architect Credit */}
            <div className="flex items-center gap-4 shrink-0 bg-white/50 dark:bg-slate-900/50 px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
                <span className="text-[10px] text-slate-500 font-mono italic tracking-tighter">Architected by</span>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 uppercase">
                    Samyakkumar Jain
                </span>
            </div>
        </div>
      </footer>

    </div>
  );
};
