import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Expense, Income, Budget, Tithe, TitheGoal, Category } from '../types';

export const useSupabaseData = (userId: string | undefined) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [titheGoals, setTitheGoals] = useState<TitheGoal[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data when user changes
  useEffect(() => {
    if (userId) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadAllData = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadExpenses(),
        loadIncomes(),
        loadBudgets(),
        loadTithes(),
        loadTitheGoals(),
        loadCategories(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Eroare la încărcarea datelor din Supabase');
    } finally {
      setLoading(false);
    }
  };

  const loadExpenses = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading expenses:', error);
        return; // Don't throw, just log and continue
      }

      if (data) {
        const formattedExpenses: Expense[] = data.map(expense => ({
          id: expense.id,
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          description: expense.description || '',
          paidBy: expense.paid_by,
          userId: expense.user_id,
        }));

        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error('Error in loadExpenses:', error);
    }
  };

  const loadIncomes = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading incomes:', error);
        return;
      }

      if (data) {
        const formattedIncomes: Income[] = data.map(income => ({
          id: income.id,
          title: income.title,
          amount: income.amount,
          category: income.category,
          date: income.date,
          description: income.description || '',
          earnedBy: income.earned_by,
          userId: income.user_id,
        }));

        setIncomes(formattedIncomes);
      }
    } catch (error) {
      console.error('Error in loadIncomes:', error);
    }
  };

  const loadBudgets = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading budgets:', error);
        return;
      }

      if (data) {
        const formattedBudgets: Budget[] = data.map(budget => ({
          id: budget.id,
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
        }));

        setBudgets(formattedBudgets);
      }
    } catch (error) {
      console.error('Error in loadBudgets:', error);
    }
  };

  const loadTithes = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('tithes')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading tithes:', error);
        return;
      }

      if (data) {
        const formattedTithes: Tithe[] = data.map(tithe => ({
          id: tithe.id,
          amount: tithe.amount,
          date: tithe.date,
          description: tithe.description || '',
          recipient: tithe.recipient,
        }));

        setTithes(formattedTithes);
      }
    } catch (error) {
      console.error('Error in loadTithes:', error);
    }
  };

  const loadTitheGoals = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('tithe_goals')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading tithe goals:', error);
        return;
      }

      if (data) {
        const formattedGoals: TitheGoal[] = data.map(goal => ({
          id: goal.id,
          targetPercentage: goal.target_percentage,
          period: goal.period,
          isActive: goal.is_active,
        }));

        setTitheGoals(formattedGoals);
      }
    } catch (error) {
      console.error('Error in loadTitheGoals:', error);
    }
  };

  const loadCategories = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      if (data) {
        const expenseCategs: Category[] = [];
        const incomeCategs: Category[] = [];

        data.forEach(category => {
          const formattedCategory: Category = {
            id: category.id,
            name: category.name,
            color: category.color,
            icon: category.icon,
          };

          if (category.type === 'expense') {
            expenseCategs.push(formattedCategory);
          } else {
            incomeCategs.push(formattedCategory);
          }
        });

        setExpenseCategories(expenseCategs);
        setIncomeCategories(incomeCategs);
      }
    } catch (error) {
      console.error('Error in loadCategories:', error);
    }
  };

  // CRUD operations for expenses
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        title: expenseData.title,
        amount: expenseData.amount,
        category: expenseData.category,
        date: expenseData.date,
        description: expenseData.description,
        paid_by: expenseData.paidBy,
      })
      .select()
      .single();

    if (error) throw error;

    const newExpense: Expense = {
      id: data.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date,
      description: data.description || '',
      paidBy: data.paid_by,
      userId: data.user_id,
    };

    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = async (expense: Expense) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description,
        paid_by: expense.paidBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', expense.id);

    if (error) throw error;

    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // CRUD operations for incomes
  const addIncome = async (incomeData: Omit<Income, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('incomes')
      .insert({
        user_id: userId,
        title: incomeData.title,
        amount: incomeData.amount,
        category: incomeData.category,
        date: incomeData.date,
        description: incomeData.description,
        earned_by: incomeData.earnedBy,
      })
      .select()
      .single();

    if (error) throw error;

    const newIncome: Income = {
      id: data.id,
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date,
      description: data.description || '',
      earnedBy: data.earned_by,
      userId: data.user_id,
    };

    setIncomes(prev => [newIncome, ...prev]);
    return newIncome;
  };

  const updateIncome = async (income: Income) => {
    const { error } = await supabase
      .from('incomes')
      .update({
        title: income.title,
        amount: income.amount,
        category: income.category,
        date: income.date,
        description: income.description,
        earned_by: income.earnedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', income.id);

    if (error) throw error;

    setIncomes(prev => prev.map(i => i.id === income.id ? income : i));
  };

  const deleteIncome = async (id: string) => {
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  // CRUD operations for budgets
  const addBudget = async (budgetData: Omit<Budget, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        category: budgetData.category,
        amount: budgetData.amount,
        period: budgetData.period,
      })
      .select()
      .single();

    if (error) throw error;

    const newBudget: Budget = {
      id: data.id,
      category: data.category,
      amount: data.amount,
      period: data.period,
    };

    setBudgets(prev => [...prev, newBudget]);
    return newBudget;
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // CRUD operations for tithes
  const addTithe = async (titheData: Omit<Tithe, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('tithes')
      .insert({
        user_id: userId,
        amount: titheData.amount,
        date: titheData.date,
        description: titheData.description,
        recipient: titheData.recipient,
      })
      .select()
      .single();

    if (error) throw error;

    const newTithe: Tithe = {
      id: data.id,
      amount: data.amount,
      date: data.date,
      description: data.description || '',
      recipient: data.recipient,
    };

    setTithes(prev => [newTithe, ...prev]);
    return newTithe;
  };

  const updateTithe = async (tithe: Tithe) => {
    const { error } = await supabase
      .from('tithes')
      .update({
        amount: tithe.amount,
        date: tithe.date,
        description: tithe.description,
        recipient: tithe.recipient,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tithe.id);

    if (error) throw error;

    setTithes(prev => prev.map(t => t.id === tithe.id ? tithe : t));
  };

  const deleteTithe = async (id: string) => {
    const { error } = await supabase
      .from('tithes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setTithes(prev => prev.filter(t => t.id !== id));
  };

  // CRUD operations for tithe goals
  const addTitheGoal = async (goalData: Omit<TitheGoal, 'id'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('tithe_goals')
      .insert({
        user_id: userId,
        target_percentage: goalData.targetPercentage,
        period: goalData.period,
        is_active: goalData.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    const newGoal: TitheGoal = {
      id: data.id,
      targetPercentage: data.target_percentage,
      period: data.period,
      isActive: data.is_active,
    };

    setTitheGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const deleteTitheGoal = async (id: string) => {
    const { error } = await supabase
      .from('tithe_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setTitheGoals(prev => prev.filter(g => g.id !== id));
  };

  // CRUD operations for categories
  const addExpenseCategory = async (categoryData: Omit<Category, 'id'>) => {
    if (!userId) return;

    console.log('Adding expense category:', categoryData);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
        type: 'expense',
      })
      .select()
      .single();

    if (error) throw error;

    const newCategory: Category = {
      id: data.id,
      name: data.name,
      color: data.color,
      icon: data.icon,
    };

    setExpenseCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const addIncomeCategory = async (categoryData: Omit<Category, 'id'>) => {
    if (!userId) return;

    console.log('Adding income category:', categoryData);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
        type: 'income',
      })
      .select()
      .single();

    if (error) throw error;

    const newCategory: Category = {
      id: data.id,
      name: data.name,
      color: data.color,
      icon: data.icon,
    };

    setIncomeCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateExpenseCategory = async (category: Category) => {
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        color: category.color,
        icon: category.icon,
      })
      .eq('id', category.id);

    if (error) throw error;

    setExpenseCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const updateIncomeCategory = async (category: Category) => {
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        color: category.color,
        icon: category.icon,
      })
      .eq('id', category.id);

    if (error) throw error;

    setIncomeCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteExpenseCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setExpenseCategories(prev => prev.filter(c => c.id !== id));
  };

  const deleteIncomeCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setIncomeCategories(prev => prev.filter(c => c.id !== id));
  };

  return {
    // Data
    expenses,
    incomes,
    budgets,
    tithes,
    titheGoals,
    expenseCategories,
    incomeCategories,
    loading,
    error,

    // Methods
    loadAllData,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addBudget,
    deleteBudget,
    addTithe,
    updateTithe,
    deleteTithe,
    addTitheGoal,
    deleteTitheGoal,
    addExpenseCategory,
    addIncomeCategory,
    updateExpenseCategory,
    updateIncomeCategory,
    deleteExpenseCategory,
    deleteIncomeCategory,
  };
};