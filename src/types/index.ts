export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paidBy: 'user' | 'household';
  userId: string;
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  earnedBy: 'user' | 'household';
  userId: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface Tithe {
  id: string;
  amount: number;
  date: string;
  description?: string;
  recipient: string;
}

export interface TitheGoal {
  id: string;
  targetPercentage: number;
  period: 'monthly' | 'weekly' | 'yearly';
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  role: 'admin' | 'user';
  nickname?: string;
  familyId?: string;
  createdBy?: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  userId: string;
  role: 'admin' | 'user';
  nickname: string;
  createdBy?: string;
  createdAt: string;
  profile?: User;
}

  familyMembers: FamilyMember[];
export type Theme = 'light' | 'dark';

  createFamilyMember: (name: string, email: string, password: string, nickname: string) => Promise<boolean>;
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  loadFamilyMembers: () => Promise<void>;
}