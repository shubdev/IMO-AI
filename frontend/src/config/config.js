const envUrl = import.meta.env.DEV
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

export const API_BASE_URL = envUrl || "http://localhost:3000";
