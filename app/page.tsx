"use client";
import React from "react";
import { LandingPage } from "../components/LandingPage";
import { ScanInput } from "../types";

export default function App() {
  const handleScan = (input: ScanInput) => {
    alert(`Scanning ${input.type}: ${input.value}\n(Simulation Mode Active)`);
    // Stage 2 will wire this to the real logic
  };

  return (
    <LandingPage 
      onScan={handleScan} 
    />
  );
}