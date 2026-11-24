/**
 * Default production API. Override with EXPO_PUBLIC_API_URL for local Next.js:
 *   EXPO_PUBLIC_API_URL=http://127.0.0.1:3000 npm start
 * Android emulator without adb reverse:
 *   EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 npm start
 */
export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || "https://billfora.vercel.app";
