"use client";
import { createContext, useContext } from "react";
// Import OperationMode (for SIMULATION/REAL) specifically
import { OperationMode } from "../types";

interface ModeContextType {
  opMode: OperationMode; // 
  setOpMode: (mode: OperationMode) => void;
}

export const ModeContext = createContext<ModeContextType>({
  opMode: "SIMULATION", 
  setOpMode: () => {},
});

export const useMode = () => useContext(ModeContext);