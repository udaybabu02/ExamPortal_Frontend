// Look for VITE_API_URL, and fallback to the correct xbw5 server!
const rawBaseUrl = import.meta.env.VITE_API_URL || "https://examportal-backend-xbw5.onrender.com";

export const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;