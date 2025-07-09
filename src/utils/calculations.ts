import { Expense, Budget } from '../types';
import { Currency } from '../contexts/LanguageContext';

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateTotalIncome = (incomes: any[]): number => {
  return incomes.reduce((total, income) => total + income.amount, 0);
};

export const calculateExpensesByCategory = (expenses: Expense[]) => {
  const categoryTotals: { [key: string]: number } = {};
  
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  return categoryTotals;
};

export const calculateExpensesByType = (expenses: Expense[]) => {
  const personal = expenses.filter(expense => expense.paidBy === 'user');
  const household = expenses.filter(expense => expense.paidBy === 'household');
  
  return {
    personal: personal.reduce((sum, expense) => sum + expense.amount, 0),
    household: household.reduce((sum, expense) => sum + expense.amount, 0)
  };
};

export const calculateIncomeByCategory = (incomes: any[]) => {
  const categoryTotals: { [key: string]: number } = {};
  
  incomes.forEach(income => {
    categoryTotals[income.category] = (categoryTotals[income.category] || 0) + income.amount;
  });

  return categoryTotals;
};

export const calculateIncomeByType = (incomes: any[]) => {
  const personal = incomes.filter(income => income.earnedBy === 'user');
  const household = incomes.filter(income => income.earnedBy === 'household');
  
  return {
    personal: personal.reduce((sum, income) => sum + income.amount, 0),
    household: household.reduce((sum, income) => sum + income.amount, 0)
  };
};
export const calculateBudgetStatus = (expenses: Expense[], budgets: Budget[]) => {
  const categoryTotals = calculateExpensesByCategory(expenses);
  
  return budgets.map(budget => {
    const spent = categoryTotals[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    
    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: Math.min(percentage, 100),
      isOverBudget: spent > budget.amount
    };
  });
};

export const filterExpensesByDateRange = (expenses: Expense[], startDate: string, endDate: string) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return expenseDate >= start && expenseDate <= end;
  });
};

export const getMonthlyExpenses = (expenses: Expense[], month: number, year: number) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
  });
};

export const formatCurrency = (amount: number, currency: Currency = 'USD', exchangeRates?: { [key: string]: number }): string => {
  // Convert amount based on exchange rates if provided
  let convertedAmount = amount;
  if (exchangeRates && currency !== 'USD') {
    convertedAmount = amount * exchangeRates[currency];
  }
  
  let locale = 'en-US';
  switch (currency) {
    case 'RON':
      locale = 'ro-RO';
      break;
    case 'EUR':
      locale = 'de-DE'; // German locale for EUR formatting
      break;
    default:
      locale = 'en-US';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(convertedAmount);
};

export const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency, exchangeRates: { [key: string]: number }): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first if not already USD
  let usdAmount = amount;
  if (fromCurrency !== 'USD') {
    usdAmount = amount / exchangeRates[fromCurrency];
  }
  
  // Convert from USD to target currency
  if (toCurrency === 'USD') {
    return usdAmount;
  }
  
  return usdAmount * exchangeRates[toCurrency];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};