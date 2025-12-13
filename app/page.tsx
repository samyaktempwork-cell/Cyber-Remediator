"use client";
import React, { useState } from "react";
import { LandingPage } from "../components/LandingPage";
import { ScanInput, OperationMode } from "../types";
import { ModeContext } from "../components/ModeContext"; // Import Context
import { ServiceFactory } from "../services/ServiceFactory"; // Import Factory

export default function App() {
  // 1. Manage the Mode State
  const [opMode, setOpMode] = useState<OperationMode>("SIMULATION");

  const handleScan = async (input: ScanInput) => {
    // 2. Get the correct provider (Mock vs Real) based on the mode
    const provider = ServiceFactory.getProvider(opMode);
    
    console.log(`[${opMode} MODE] Initiating Scan for: ${input.value}`);
    
    try {
      // 3. Execute the scan using your new Logic Core
      const report = await provider.scanIdentity(input);
      
      // 4. Verify the result (For now, alert the Mock Data to prove it works)
      alert(`SUCCESS!\n\nProvider: ${opMode}\nRisk Score: ${report.riskScore}\nFound Breaches: ${report.foundBreaches}\n\n(See Console for full report)`);
      console.log("Full Intelligence Report:", report);
      
    } catch (error) {
      console.error("Scan Failed:", error);
      alert("Error executing scan.");
    }
  };

  return (
    // 5. Wrap the app in the Context Provider
    <ModeContext.Provider value={{ opMode, setOpMode }}>
      <LandingPage onScan={handleScan} />
    </ModeContext.Provider>
  );
}