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
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}