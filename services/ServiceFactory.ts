
import { ISecurityProvider } from "./interfaces/ISecurityProvider";
import { MockProvider } from "./providers/MockProvider";
import { RealProvider } from "./providers/RealProvider";

export type OperationMode = "SIMULATION" | "REAL";

export class ServiceFactory {
  private static mockProvider = new MockProvider();
  private static realProvider = new RealProvider();

  static getProvider(mode: OperationMode): ISecurityProvider {
    return mode === "REAL" ? this.realProvider : this.mockProvider;
  }
}
