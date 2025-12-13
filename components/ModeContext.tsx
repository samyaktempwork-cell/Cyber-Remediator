"use client";
import { createContext, useContext } from "react";
import { OperationMode } from "../types";

interface ModeContextType {
  opMode: OperationMode;
  setOpMode: (mode: OperationMode) => void;
}

// Default state is SIMULATION to ensure safety during demos
export const ModeContext = createContext<ModeContextType>({
  opMode: "SIMULATION",
  setOpMode: () => {},
});

export const useMode = () => useContext(ModeContext);