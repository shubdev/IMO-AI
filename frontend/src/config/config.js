// In development: use empty string so Vite proxy handles /api/* → localhost:3000 (no CORS issues)
// In production: use VITE_API_URL (e.g. https://imo-ai.onrender.com)
export const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_PROXY_TARGET || "")
  : (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
