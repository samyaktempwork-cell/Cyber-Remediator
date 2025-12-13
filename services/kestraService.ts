
import { LogEntry } from "../types";

export const KestraService = {
  /**
   * Actual utility for connecting to Kestra execution API.
   * In simulation mode, MockProvider handles this logic.
   */
  async fetchExecutionLogs(executionId: string, onLog: (log: LogEntry) => void) {
    // Logic for production streaming of Kestra event logs
    console.log("KestraService: Connecting to execution stream", executionId);
  }
};
