// Mock Supabase client for development
// In production, use Lovable's native Supabase integration

const mockSupabase = {
  auth: {
    signUp: async (data: any) => ({ data: { user: null }, error: null }),
    signInWithPassword: async (data: any) => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async (email: string) => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Return a subscription object
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: [], error: null }),
    update: () => ({ data: [], error: null }),
    delete: () => ({ data: [], error: null })
  }),
  functions: {
    invoke: async (functionName: string, options: any) => {
      console.log(`Mock Supabase function call: ${functionName}`, options);
      return { data: null, error: null };
    }
  }
};

export const supabase = mockSupabase;

// Note: To use real Supabase functionality, activate Lovable's native Supabase integration
// by clicking the green Supabase button in the top right of the interface