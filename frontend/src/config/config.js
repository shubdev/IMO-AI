const envUrl = import.meta.env.DEV
    ? "http://localhost:3000"
    : "";

export const API_BASE_URL = envUrl || "http://localhost:3000";
