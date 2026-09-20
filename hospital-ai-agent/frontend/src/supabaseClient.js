/**
 * Authentication & Database Client
 * Powered by MongoDB Atlas and JWT Authentication.
 * Re-exports the unified auth client to maintain 100% backward compatibility
 * with all existing components across the application.
 */

export {
  authClient,
  authClient as supabase,
  hasSupabaseConfig,
  isDemoMode,
  getDemoSession,
  saveDemoSession,
  clearDemoSession,
  getDemoUsers,
  saveDemoUsers,
  buildDemoResponse,
  apiLogin,
  apiRegister,
} from "./authClient";
