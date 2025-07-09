import { Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const getDefaultCategories = (t: (key: string) => string): Category[] => [
  { id: '1', name: t('category.foodDining'), color: '#ef4444', icon: 'Utensils' },
  { id: '2', name: t('category.transportation'), color: '#3b82f6', icon: 'Car' },
  { id: '3', name: t('category.shopping'), color: '#8b5cf6', icon: 'ShoppingBag' },
  { id: '4', name: t('category.entertainment'), color: '#f59e0b', icon: 'GameController2' },
  { id: '5', name: t('category.healthFitness'), color: '#10b981', icon: 'Heart' },
  { id: '6', name: t('category.education'), color: '#06b6d4', icon: 'GraduationCap' },
  { id: '7', name: t('category.billsUtilities'), color: '#84cc16', icon: 'Receipt' },
  { id: '8', name: t('category.travel'), color: '#f97316', icon: 'Plane' },
  { id: '9', name: t('category.other'), color: '#6b7280', icon: 'MoreHorizontal' },
];

export const getIncomeCategories = (t: (key: string) => string): Category[] => [
  { id: '1', name: t('incomeCategory.salary'), color: '#10b981', icon: 'Briefcase' },
  { id: '2', name: t('incomeCategory.freelance'), color: '#3b82f6', icon: 'Laptop' },
  { id: '3', name: t('incomeCategory.business'), color: '#8b5cf6', icon: 'Building2' },
  { id: '4', name: t('incomeCategory.investments'), color: '#f59e0b', icon: 'TrendingUp' },
  { id: '5', name: t('incomeCategory.rental'), color: '#ef4444', icon: 'Home' },
  { id: '6', name: t('incomeCategory.bonus'), color: '#06b6d4', icon: 'Gift' },
  { id: '7', name: t('incomeCategory.refund'), color: '#84cc16', icon: 'RotateCcw' },
  { id: '8', name: t('incomeCategory.pension'), color: '#f97316', icon: 'Shield' },
  { id: '9', name: t('incomeCategory.other'), color: '#6b7280', icon: 'MoreHorizontal' },
];

// For backward compatibility
export const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#ef4444', icon: 'Utensils' },
  { id: '2', name: 'Transportation', color: '#3b82f6', icon: 'Car' },
  { id: '3', name: 'Shopping', color: '#8b5cf6', icon: 'ShoppingBag' },
  { id: '4', name: 'Entertainment', color: '#f59e0b', icon: 'GameController2' },
  { id: '5', name: 'Health & Fitness', color: '#10b981', icon: 'Heart' },
  { id: '6', name: 'Education', color: '#06b6d4', icon: 'GraduationCap' },
  { id: '7', name: 'Bills & Utilities', color: '#84cc16', icon: 'Receipt' },
  { id: '8', name: 'Travel', color: '#f97316', icon: 'Plane' },
  { id: '9', name: 'Other', color: '#6b7280', icon: 'MoreHorizontal' },
];