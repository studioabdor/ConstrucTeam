"use client";

import { ReactNode } from 'react';
import { useAuthContext, AuthContext } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthContext();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
