const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://examportal-backend-ei48.onrender.com";
export const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;