import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    const currentUserId = localStorage.getItem('currentUserId');
    
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      
      if (currentUserId) {
        const currentUser = parsedUsers.find((u: User) => u.id === currentUserId);
        if (currentUser) {
          setUser(currentUser);
        }
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would be handled by a backend
    const savedUsers = localStorage.getItem('users');
    const savedPasswords = localStorage.getItem('userPasswords');
    
    if (savedUsers && savedPasswords) {
      const users = JSON.parse(savedUsers);
      const passwords = JSON.parse(savedPasswords);
      
      const foundUser = users.find((u: User) => u.email === email);
      if (foundUser && passwords[foundUser.id] === password) {
        setUser(foundUser);
        localStorage.setItem('currentUserId', foundUser.id);
        return true;
      }
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Store password (in production, this would be hashed and stored securely)
    const savedPasswords = localStorage.getItem('userPasswords');
    const passwords = savedPasswords ? JSON.parse(savedPasswords) : {};
    passwords[newUser.id] = password;
    localStorage.setItem('userPasswords', JSON.stringify(passwords));
    
    setUser(newUser);
    localStorage.setItem('currentUserId', newUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const switchUser = (userId: string) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUserId', foundUser.id);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      register,
      logout,
      switchUser,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};