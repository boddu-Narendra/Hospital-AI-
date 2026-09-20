import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const looksLikePlaceholder = (value) =>
  !value || value.includes("example") || value.includes("your_") || value.includes("dummy") || value.includes("replace");

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey && !looksLikePlaceholder(supabaseUrl) && !looksLikePlaceholder(supabaseAnonKey));

if (!hasSupabaseConfig) {
  console.warn("Supabase env vars are missing or still using placeholder values. Switching to demo mode.");
}

export const isDemoMode = !hasSupabaseConfig;

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const getDemoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("demo_users") || "[]");
  } catch {
    return [];
  }
};

export const saveDemoUsers = (users) => {
  localStorage.setItem("demo_users", JSON.stringify(users));
};

export const getDemoSession = () => {
  try {
    return JSON.parse(localStorage.getItem("demo_session") || "null");
  } catch {
    return null;
  }
};

export const saveDemoSession = (session) => {
  localStorage.setItem("demo_session", JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("demo-session-change", { detail: session }));
};

export const clearDemoSession = () => {
  localStorage.removeItem("demo_session");
  window.dispatchEvent(new CustomEvent("demo-session-change", { detail: null }));
};

export const buildDemoResponse = (message) => {
  const text = message.toLowerCase();

  if (text.includes("fever") || text.includes("temperature")) {
    return "You mentioned fever. Rest, stay hydrated, and monitor your temperature. If it stays high or you feel worsening symptoms, contact a clinician promptly.";
  }

  if (text.includes("cough") || text.includes("cold")) {
    return "A cough or cold is often manageable with fluids, rest, and warm steam. If your breathing becomes difficult or symptoms worsen, seek medical guidance.";
  }

  if (text.includes("headache")) {
    return "For a headache, rest in a quiet room, hydrate, and avoid screens. Seek urgent help if it is sudden, severe, or comes with confusion or vision changes.";
  }

  if (text.includes("pain") || text.includes("stomach")) {
    return "For abdominal discomfort, stay hydrated and avoid heavy meals. Severe or worsening pain should be checked by a healthcare professional.";
  }

  if (text.includes("anxiety") || text.includes("stress")) {
    return "Stress and anxiety can improve with rest, breathing exercises, and a calmer routine. If symptoms are severe or persistent, speaking with a professional is a good next step.";
  }

  return "I understand your concern. Please monitor your symptoms closely, drink fluids, rest, and seek medical guidance if the condition becomes severe or persists.";
};
