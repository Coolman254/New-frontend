// Supabase replaced with custom Express backend.
// This stub prevents import errors during migration.

export const supabase = {
  auth: {
    signIn: async () => ({}),
    signOut: async () => ({}),
    session: () => null,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    eq: () => ({ data: null, error: null }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
};