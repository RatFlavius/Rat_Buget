import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { FamilyMember } from '../types';

// Ensure the hook is properly exported
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
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
          await loadFamilyMembers();
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
        // Generate family ID for first user (admin)
        const familyId = crypto.randomUUID();
        
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url || null,
            role: 'admin', // First user is always admin
            nickname: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            family_id: familyId,
          });

        if (error) {
          console.error('Error creating profile:', error);
          // Don't throw, just log
        } else {
          // Create family member entry
          await supabase
            .from('family_members')
            .insert({
              family_id: familyId,
              user_id: user.id,
              role: 'admin',
              nickname: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            });
        }
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // Don't throw, just log
    }
  };

  const loadFamilyMembers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          *,
          profiles!family_members_user_id_fkey (
            user_id,
            name,
            email,
            avatar,
            role,
            nickname
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading family members:', error);
        return;
      }

      if (data) {
        const formattedMembers: FamilyMember[] = data.map(member => ({
          id: member.id,
          familyId: member.family_id,
          userId: member.user_id,
          role: member.role,
          nickname: member.nickname,
          createdBy: member.created_by,
          createdAt: member.created_at,
          profile: member.profiles ? {
            id: member.profiles.user_id,
            name: member.profiles.name,
            email: member.profiles.email,
            avatar: member.profiles.avatar,
            role: member.profiles.role,
            nickname: member.profiles.nickname,
          } : undefined,
        }));

        setFamilyMembers(formattedMembers);
      }
    } catch (error) {
      console.error('Error in loadFamilyMembers:', error);
    }
  };

  const createFamilyMember = async (name: string, email: string, password: string, nickname: string) => {
    if (!user) return false;
    
    try {
      // Get current user's family ID
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('family_id, role')
        .eq('user_id', user.id)
        .single();

      if (profileError || !currentProfile || currentProfile.role !== 'admin') {
        console.error('Only admins can create family members');
        return false;
      }

      // Create new user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            nickname,
          },
        },
      });

      if (authError || !authData.user) {
        console.error('Error creating user account:', authError);
        return false;
      }

      // Create profile for new user
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          name,
          email,
          role: 'user',
          nickname,
          family_id: currentProfile.family_id,
          created_by: user.id,
        });

      if (profileInsertError) {
        console.error('Error creating profile:', profileInsertError);
        return false;
      }

      // Create family member entry
      const { error: familyMemberError } = await supabase
        .from('family_members')
        .insert({
          family_id: currentProfile.family_id,
          user_id: authData.user.id,
          role: 'user',
          nickname,
          created_by: user.id,
        });

      if (familyMemberError) {
        console.error('Error creating family member:', familyMemberError);
        return false;
      }

      // Reload family members
      await loadFamilyMembers();
      return true;
    } catch (error) {
      console.error('Error in createFamilyMember:', error);
      return false;
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
    familyMembers,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    createFamilyMember,
    loadFamilyMembers,
  };
};