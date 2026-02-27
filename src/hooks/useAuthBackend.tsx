// Re-export everything from the main useAuth hook for backward compatibility
export { useAuth, type UserRole } from './useAuth';
import { useAuth } from './useAuth';
import { createContext, useContext } from 'react';

// Create a simple provider that just renders children (auth state is managed by Supabase)
const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
