"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  // Add other profile fields as needed
}

interface AuthContextType {
  user: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setAuthLoading(false);
      if (error) {
        console.error('Error getting session:', error.message, error.status);
        return;
      }
      if (session?.user) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError.message, userError.status);
          return;
        }
        if (user) {
          await fetchProfile(user);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthLoading(false);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, is_admin')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message, error.code, error.details, error.hint);
        throw error;
      }

      if (data) {
        if (data.is_admin === true) {
          setUser(data);
        } else {
          // Not admin, sign out and redirect
          await supabase.auth.signOut();
          setUser(null);
          router.push('/login');
        }
      } else {
        console.warn('No profile found for user ID:', supabaseUser.id, '. Possible causes: missing trigger, RLS denial, or mismatched user ID.');
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message, error.code, error.details, error.hint);
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user && pathname.startsWith("/dashboard")) {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthLoading(false);
      throw error;
    }
    // Profile fetching will be handled by onAuthStateChange
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
