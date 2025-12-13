import { ISecurityProvider } from "./interfaces/ISecurityProvider";
import { MockProvider } from "./providers/MockProvider";
// We will import RealProvider here in Stage 4
import { OperationMode } from "../types";

export class ServiceFactory {
  static getProvider(mode: OperationMode): ISecurityProvider {
    if (mode === "REAL") {
      console.log("Real Mode requested (Returning Mock until Stage 4 integration)");
      // In Stage 4, this will change to: return new RealProvider();
      return new MockProvider();
    }
    return new MockProvider();
  }
}