// Mock Supabase client for development
// In production, use Lovable's native Supabase integration

const createMockQuery = () => ({
  select: (columns?: string) => createMockQuery(),
  insert: (data: any) => createMockQuery(),
  update: (data: any) => createMockQuery(),
  delete: () => createMockQuery(),
  eq: (column: string, value: any) => createMockQuery(),
  neq: (column: string, value: any) => createMockQuery(),
  gt: (column: string, value: any) => createMockQuery(),
  gte: (column: string, value: any) => createMockQuery(),
  lt: (column: string, value: any) => createMockQuery(),
  lte: (column: string, value: any) => createMockQuery(),
  like: (column: string, pattern: string) => createMockQuery(),
  ilike: (column: string, pattern: string) => createMockQuery(),
  is: (column: string, value: any) => createMockQuery(),
  in: (column: string, values: any[]) => createMockQuery(),
  contains: (column: string, value: any) => createMockQuery(),
  containedBy: (column: string, value: any) => createMockQuery(),
  rangeGt: (column: string, value: any) => createMockQuery(),
  rangeGte: (column: string, value: any) => createMockQuery(),
  rangeLt: (column: string, value: any) => createMockQuery(),
  rangeLte: (column: string, value: any) => createMockQuery(),
  rangeAdjacent: (column: string, value: any) => createMockQuery(),
  overlaps: (column: string, value: any) => createMockQuery(),
  textSearch: (column: string, query: string) => createMockQuery(),
  match: (query: Record<string, any>) => createMockQuery(),
  not: (column: string, operator: string, value: any) => createMockQuery(),
  or: (filters: string) => createMockQuery(),
  filter: (column: string, operator: string, value: any) => createMockQuery(),
  order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => createMockQuery(),
  limit: (count: number) => createMockQuery(),
  range: (from: number, to: number) => createMockQuery(),
  single: () => Promise.resolve({ data: null, error: null }),
  maybeSingle: () => Promise.resolve({ data: null, error: null }),
  then: (resolve: (value: { data: any; error: any }) => void) => {
    resolve({ data: [], error: null });
  }
});

const mockSupabase = {
  auth: {
    signUp: async (credentials: { email: string; password: string; options?: any }) => ({ 
      data: { 
        user: null,
        session: null 
      }, 
      error: null 
    }),
    signInWithPassword: async (credentials: { email: string; password: string }) => ({ 
      data: { 
        user: null,
        session: null 
      }, 
      error: null 
    }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async (email: string, options?: any) => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Return a subscription object
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        },
        error: null
      };
    }
  },
  from: (table: string) => createMockQuery(),
  functions: {
    invoke: async (functionName: string, options?: any) => {
      console.log(`Mock Supabase function call: ${functionName}`, options);
      return { data: null, error: null };
    }
  }
};

export const supabase = mockSupabase;

// Note: To use real Supabase functionality, activate Lovable's native Supabase integration
// by clicking the green Supabase button in the top right of the interface