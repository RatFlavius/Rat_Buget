import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Ensure the hook is properly exported
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    console.log('useSupabaseAuth: Starting initialization');

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('useSupabaseAuth: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('useSupabaseAuth: Session data:', { session, error });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Eroare la obținerea sesiunii');
        } else {
          setError(null);
        }
        
      } catch (err) {
        if (!mounted) return;
        console.error('Error in getSession:', err);
        setError('Eroare la conectarea cu Supabase');
        setSession(null);
        setUser(null);
      }
      
      if (mounted) {
        console.log('useSupabaseAuth: Setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      console.log('useSupabaseAuth: Auth state changed:', { _event, session });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user && _event === 'SIGNED_IN') {
        try {
          await createUserProfile(session.user);
        } catch (error) {
          console.error('Error creating profile:', error);
          // Don't set error here as it's not critical
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfiles, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id);

      if (selectError) {
        console.error('Error checking existing profiles:', selectError);
        return; // Don't throw, just return
      }

      if (!existingProfiles || existingProfiles.length === 0) {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url || null,
          });

        if (error) {
          console.error('Error creating profile:', error);
          // Don't throw, just log
        }
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // Don't throw, just log
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
      // Don't try to create profile immediately if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        // User needs to confirm email first
        return data;
      }
      
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
};