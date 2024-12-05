import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { users } from '../lib/db/users';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (username: string, password: string) => {
    // Check for admin credentials
    if (username === 'ad2989846' && password === 'admin') {
      const adminUser: User = {
        id: '1',
        username: 'ad2989846',
        email: 'admin@modelshare.com',
        isAdmin: true,
      };
      setAuthState({ user: adminUser, isAuthenticated: true });
      return true;
    }

    // Check for regular user
    try {
      const user = await users.findByUsername(username);
      if (user && user.password === password) {
        setAuthState({ 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin || false,
          }, 
          isAuthenticated: true 
        });
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}