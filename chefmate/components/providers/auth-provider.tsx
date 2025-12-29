
import React from 'react';
import { isSupabaseConfigured } from '../../lib/config';
import { MockAuthProvider } from './mock-auth-provider';
import { SupabaseAuthProvider } from './supabase-auth-provider';
import { UserContext } from '../../hooks/useUser';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ProviderComponent = isSupabaseConfigured ? SupabaseAuthProvider : MockAuthProvider;

  return (
    <ProviderComponent>
      {(contextValue) => (
        <UserContext.Provider value={contextValue}>
          {children}
        </UserContext.Provider>
      )}
    </ProviderComponent>
  );
};
