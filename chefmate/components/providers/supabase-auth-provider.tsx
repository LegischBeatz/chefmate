
import React, { useState, useEffect, useRef } from 'react';
import { UserContextType, UserProfile } from '../../types';
import { supabase } from '../../lib/supabase';
import { sendWelcomeEmailAction } from '../../lib/actions/email';

export const SupabaseAuthProvider: React.FC<{ children: (context: UserContextType) => React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState({ used: 2, limit: 5 });
  
  // Track if a user was just created to trigger welcome email
  const isNewUserRef = useRef(false);

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
        
        // Check if we need to send welcome email
        // We use the Ref set during login/signup or we could check metadata if Supabase supported 'last_sign_in_at' === 'created_at' reliably in client
        if (event === 'SIGNED_IN' && isNewUserRef.current) {
            if (session.user.email) {
                sendWelcomeEmailAction(session.user.email);
            }
            isNewUserRef.current = false; // Reset
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (sbUser: any) => {
    setUser({
      id: sbUser.id,
      email: sbUser.email || '',
      name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Chef',
      tier: sbUser.user_metadata?.tier || 'free',
    });
  };

  const login = async (email?: string, password?: string) => {
    if (!supabase) return;
    
    if (email && password) {
      // Try Sign In
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If sign in fails, try Sign Up (Hybrid flow for demo)
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0],
              tier: 'free'
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Mark as new user to trigger welcome email in onAuthStateChange
        if (data.user) {
            isNewUserRef.current = true;
        }
      }
    } else {
        console.warn("Supabase login requires credentials");
    }
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user && supabase) {
      setUser({ ...user, ...data });
      supabase.auth.updateUser({
        data: {
            name: data.name,
            tier: data.tier
        }
      });
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
