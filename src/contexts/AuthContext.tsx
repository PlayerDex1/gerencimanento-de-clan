import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any;
  profile: any;
  clan: any;
  member: any;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshContext: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mock user data to bypass login completely
  const [user] = useState<any>({ id: 'mock-user-123', email: 'admin@local.dev' });
  const [profile] = useState<any>({ id: 'mock-user-123', username: 'Admin' });
  
  // Mock clan data so we go straight to the dashboard
  const [clan] = useState<any>({ 
    id: 'mock-clan-123', 
    name: 'Admin Clan', 
    server: 'LocalServer',
    leader_id: 'mock-user-123'
  });
  
  const [member] = useState<any>({ 
    id: 'mock-member-123', 
    clan_id: 'mock-clan-123', 
    role: 'leader',
    in_game_name: 'AdminPlayer'
  });

  const [loading] = useState(false);

  const signOut = async () => {
    console.log('Sign out disabled in mock mode');
  };

  const refreshContext = async () => {
    console.log('Refresh context disabled in mock mode');
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
