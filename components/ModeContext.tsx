"use client";
import { createContext, useContext } from "react";
import { OperationMode } from "../types";

export const ModeContext = createContext<{
  opMode: OperationMode;
  setOpMode: (m: OperationMode) => void;
}>({ opMode: "SIMULATION", setOpMode: () => {} });

export const useMode = () => useContext(ModeContext);