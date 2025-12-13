import { Tier } from "../types";

export class AuthService {
  static login(email: string, pass?: string) {
    if (email.includes("admin")) {
        return { email, tier: "PRO" as Tier };
    }
    return null;
  }
}