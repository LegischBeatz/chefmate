
import React, { createContext, useContext } from 'react';
import { UserContextType } from '../types';

// Create the context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook to consume the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};

// Export the AuthProvider for wrapping the app
// We re-export it here to maintain backward compatibility with imports in App.tsx if needed,
// but we will update App.tsx to import from the new location to be clean.
export { AuthProvider as UserProvider } from '../components/providers/auth-provider';
