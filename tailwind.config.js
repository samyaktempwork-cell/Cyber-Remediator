import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // Crucial for your Dark Mode toggle
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}", // specific to your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;