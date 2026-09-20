/**
 * API Configuration
 * Supports dynamic backend URL configuration across development and production environments.
 *
 * In local development, if VITE_BACKEND_URL is not set, API calls use relative paths ('/api/...'),
 * which Vite automatically proxies to http://localhost:8000.
 *
 * In production (e.g. deployed on Render), set VITE_BACKEND_URL to your deployed Render API URL:
 * e.g. https://hospital-ai-agent-api.onrender.com
 */

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "";
export const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  chat: `${BACKEND_URL}/api/chat`,
  history: `${BACKEND_URL}/api/chat/history`,
  profile: `${BACKEND_URL}/api/profile`,
  register: `${BACKEND_URL}/api/auth/register`,
  login: `${BACKEND_URL}/api/auth/login`,
  me: `${BACKEND_URL}/api/auth/me`,
};
