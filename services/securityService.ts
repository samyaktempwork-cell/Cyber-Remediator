
/** 
 * Legacy SecurityService refactored into the Strategy Pattern.
 * Please use ServiceFactory.getProvider() instead.
 */
import { ServiceFactory } from "./ServiceFactory";

export const SecurityService = {
  // Maintaining a small bridge for simple calls if needed
  performDeepScan: (identity: string) => ServiceFactory.getProvider("SIMULATION").performScan(identity),
  getThreatGraph: (identity: string) => ServiceFactory.getProvider("SIMULATION").getThreatGraph(identity),
};
