"use client";
import { createContext, useContext } from "react";
import { AppMode } from "../types"; // Adjust path if types.ts is in root

interface ModeContextType {
  opMode: AppMode;
  setOpMode: (mode: AppMode) => void;
}

// Create the context
export const ModeContext = createContext<ModeContextType>({
  opMode: "SIMULATION",
  setOpMode: () => {},
});

// Helper hook to use it easily
export const useMode = () => useContext(ModeContext);