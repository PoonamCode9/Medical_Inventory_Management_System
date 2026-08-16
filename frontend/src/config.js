// The single place that decides which backend the web app talks to.
// - Local development: falls back to your dev server on port 8080.
// - Production (Netlify): set VITE_API_URL to your Render backend URL.
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');