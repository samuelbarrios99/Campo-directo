(() => {
  "use strict";

  const SUPABASE_URL = "TU_PROJECT_URL";
  const SUPABASE_KEY = "TU_PUBLISHABLE_KEY";

  if (!window.supabase) {
    throw new Error("No se cargó la librería de Supabase.");
  }

  if (
    SUPABASE_URL === "TU_PROJECT_URL" ||
    SUPABASE_KEY === "TU_PUBLISHABLE_KEY"
  ) {
    throw new Error("Configura las credenciales de Supabase.");
  }

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
})();