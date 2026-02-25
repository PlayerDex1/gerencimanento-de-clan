import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: any;
  profile: any;
  clan: any;
  member: any;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshContext: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [clan, setClan] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/context`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setClan(data.clan);
        setMember(data.member);
      }
    } catch (error) {
      console.error('Failed to fetch user context', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchContext(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchContext(session.user.id);
      } else {
        setProfile(null);
        setClan(null);
        setMember(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshContext = async () => {
    if (user) await fetchContext(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, profile, clan, member, loading, signOut, refreshContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
