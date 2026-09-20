import { API_ENDPOINTS } from "./apiConfig";

// ----------------------------------------------------------------------------
// Local Session & Storage Management
// ----------------------------------------------------------------------------
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
  localStorage.removeItem("profile");
  window.dispatchEvent(new CustomEvent("demo-session-change", { detail: null }));
};

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

// ----------------------------------------------------------------------------
// Backend JWT Authentication Calls
// ----------------------------------------------------------------------------
export const apiLogin = async (identifier, password) => {
  try {
    const res = await fetch(API_ENDPOINTS.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { error: { message: errData.detail || "Invalid login credentials" } };
    }

    const data = await res.json();
    const session = {
      access_token: data.access_token,
      token_type: data.token_type,
      user: data.user,
    };
    saveDemoSession(session);
    return { data: { session, user: data.user }, error: null };
  } catch (err) {
    console.warn("Backend auth call failed, falling back to local session:", err);
    return { error: { message: "Could not connect to authentication server" } };
  }
};

export const apiRegister = async (userData) => {
  try {
    const res = await fetch(API_ENDPOINTS.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { error: { message: errData.detail || "Registration failed" } };
    }

    const data = await res.json();
    const session = {
      access_token: data.access_token,
      token_type: data.token_type,
      user: data.user,
    };
    saveDemoSession(session);
    return { data: { session, user: data.user }, error: null };
  } catch (err) {
    console.warn("Backend registration call failed:", err);
    return { error: { message: "Could not connect to registration server" } };
  }
};

// ----------------------------------------------------------------------------
// Clinical Knowledge Engine Response Helper (Demo & Offline fallback)
// ----------------------------------------------------------------------------
export const buildDemoResponse = (message) => {
  const text = (message || "").toLowerCase();

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

// ----------------------------------------------------------------------------
// Universal Supabase-compatible Auth Client Interface
// Ensures 100% backward compatibility for all existing UI components
// ----------------------------------------------------------------------------
export const hasSupabaseConfig = true;
export const isDemoMode = false;

export const authClient = {
  auth: {
    async getSession() {
      const session = getDemoSession();
      return { data: { session }, error: null };
    },
    onAuthStateChange(callback) {
      const handler = (e) => {
        callback(e.detail ? "SIGNED_IN" : "SIGNED_OUT", e.detail);
      };
      window.addEventListener("demo-session-change", handler);
      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener("demo-session-change", handler),
          },
        },
      };
    },
    async signOut() {
      clearDemoSession();
      return { error: null };
    },
    async signInWithPassword({ email, password }) {
      return await apiLogin(email, password);
    },
    async signUp({ email, password, options }) {
      return await apiRegister({
        email,
        password,
        ...(options?.data || {}),
      });
    },
  },
  from(table) {
    return {
      async upsert(data) {
        const session = getDemoSession();
        if (session?.access_token) {
          try {
            await fetch(API_ENDPOINTS.profile, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify(data),
            });
          } catch (e) {
            console.warn("Could not sync profile to backend:", e);
          }
        }
        localStorage.setItem("profile", JSON.stringify(data));
        return { data, error: null };
      },
      select() {
        return {
          eq() {
            return {
              single: async () => ({ data: getDemoSession()?.user || {}, error: null }),
            };
          },
        };
      },
    };
  },
};

export const supabase = authClient;
