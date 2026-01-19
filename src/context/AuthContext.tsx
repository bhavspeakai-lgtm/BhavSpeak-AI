import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SignupData, LoginData, AuthState } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  signup: (data: SignupData) => Promise<boolean>;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'slang-speak-studio-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const { toast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem(STORAGE_KEY);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('slang-speak-studio-users') || '[]');
      const userExists = existingUsers.find((u: User) => u.email === data.email);
      
      if (userExists) {
        toast({
          title: 'Signup Failed',
          description: 'An account with this email already exists.',
          variant: 'destructive',
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        pretestCompleted: false,
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('slang-speak-studio-users', JSON.stringify(existingUsers));

      // Set as current user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: 'Account Created! 🎉',
        description: 'Welcome to Slang Speak Studio!',
      });

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup Failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('slang-speak-studio-users') || '[]');
      const user = users.find((u: User) => u.email === data.email && u.password === data.password);

      if (!user) {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        });
        return false;
      }

      // Set as current user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast({
        title: 'Welcome Back! 👋',
        description: `Hello, ${user.fullName}!`,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('slang-speak-studio-users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('slang-speak-studio-users', JSON.stringify(updatedUsers));

    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signup,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

