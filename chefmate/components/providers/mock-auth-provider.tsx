
import React, { useState } from 'react';
import { UserContextType, UserProfile } from '../../types';
import { sendWelcomeEmailAction } from '../../lib/actions/email';

export const MockAuthProvider: React.FC<{ children: (context: UserContextType) => React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState({ used: 2, limit: 5 });

  const login = async (email?: string, password?: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUserEmail = email || 'user@chefmate.ai';
    
    setUser({
      id: 'u1',
      name: email ? email.split('@')[0] : 'Chef User',
      email: newUserEmail,
      tier: 'pro'
    });

    // Simulate Welcome Email Trigger
    // In mock, we assume every login via the form is a 'new' session worth greeting for demo purposes, 
    // or specifically if they came from the "Signup" page (though we don't track source page here easily).
    // To be safe and show off the feature, we'll send it.
    await sendWelcomeEmailAction(newUserEmail);
  };

  const logout = async () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const incrementUsage = () => {
    setUsage(prev => ({ ...prev, used: prev.used + 1 }));
  };

  const contextValue: UserContextType = {
    user,
    usage,
    login,
    logout,
    updateProfile,
    incrementUsage
  };

  return <>{children(contextValue)}</>;
};
