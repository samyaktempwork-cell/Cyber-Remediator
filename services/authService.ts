
import { MOCK_USERS } from "../constants";
import { Tier } from "../types";

export const AuthService = {
  login: (email: string, password?: string) => {
    // Check if user exists in mock registry
    const user = MOCK_USERS[email];
    
    if (user) {
        // Validate Password
        if (user.password && user.password !== password) {
            return null;
        }
        return user;
    }
    return null;
  },

  logout: () => {
    // Clear any session storage if we had it
    return true;
  },

  getUserTier: (email: string): Tier => {
    return MOCK_USERS[email]?.tier || "FREE";
  },

  requestPasswordReset: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Check if email is valid format
    if (!email.includes("@")) {
      return { success: false, message: "Invalid email address format." };
    }
    // Simulate success for demo purposes
    return { success: true, message: `Reset link sent to ${email}` };
  },

  verifyDemoKey: (key: string) => {
    // Special key or authorized email to unlock the Real Mode for demo purposes
    const normalizedKey = key.trim().toLowerCase();
    return normalizedKey === "aegis-live-2024" || normalizedKey === "samyaktempwork@gmail.com";
  }
};
