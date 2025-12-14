import { Tier } from "../types";

export interface User {
  email: string;
  tier: Tier;
  name: string;
  password?: string;
}

const MOCK_USERS: Record<string, User> = {
  // Original Demo User
  "test@demo.com": { 
    email: "test@demo.com", 
    tier: "FREE", 
    name: "Demo User",
    password: "password" 
  },
  
  // NEW: Pro User
  "pro@aegis.com": { 
    email: "pro@aegis.com", 
    tier: "PRO", 
    name: "Aegis Pro",
    password: "password" 
  },

  // NEW: Premium User
  "premium@aegis.com": { 
    email: "premium@aegis.com", 
    tier: "PREMIUM", 
    name: "Aegis Premium",
    password: "password" 
  },

  // NEW: Admin/You
  "samyaktempwork@gmail.com": { 
    email: "samyaktempwork@gmail.com", 
    tier: "PREMIUM", 
    name: "Samyakkumar (Admin)",
    password: "password" // Optional: remove this line if you want passwordless
  }
};

export const AuthService = {
  login: (email: string, password?: string) => {
    // Check if user exists in mock registry
    const user = MOCK_USERS[email];
    
    if (user) {
        // Validate Password (Optional: For hackathon demo, you can comment this out to make login easier)
        if (user.password && password && user.password !== password) {
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