import React, { useState } from 'react';
import { Plus, Home, User, TrendingUp, TrendingDown, DollarSign, Edit3, Trash2 } from 'lucide-react';
import { Expense, Income, Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { formatCurrency, formatDate } from '../utils/calculations';
import * as LucideIcons from 'lucide-react';
import FinancialCharts from './FinancialCharts';

interface JointFinancesProps {
  expenses: Expense[];
  incomes: Income[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  onAddExpense: () => void;
  onAddIncome: () => void;
  onEditExpense: (expense: Expense) => void;
  onEditIncome: (income: Income) => void;
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
}

const JointFinances: React.FC<JointFinancesProps> = ({
  expenses,
  incomes,
  expenseCategories,
  incomeCategories,
  onAddExpense,
  onAddIncome,
  onEditExpense,
  onEditIncome,
  onDeleteExpense,
  onDeleteIncome
}) => {
  const { t, currency, exchangeRates } = useLanguage();
  const { user, familyMembers } = useSupabaseAuth();
  const [activeView, setActiveView] = useState<'household' | 'personal'>('household');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Filter expenses and incomes by type
  const householdExpenses = expenses.filter(expense => expense.paidBy === 'household');
  const personalExpenses = expenses.filter(expense => expense.paidBy === 'user');
  const householdIncomes = incomes.filter(income => income.earnedBy === 'household');
  const personalIncomes = incomes.filter(income => income.earnedBy === 'user');

  // Filter by selected member if any
  const filteredExpenses = selectedMember 
    ? expenses.filter(expense => expense.userId === selectedMember)
    : (activeView === 'household' ? householdExpenses : personalExpenses);
    
  const filteredIncomes = selectedMember
    ? incomes.filter(income => income.userId === selectedMember)
    : (activeView === 'household' ? householdIncomes : personalIncomes);

  // Calculate totals
  const totalHouseholdExpenses = householdExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPersonalExpenses = personalExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalHouseholdIncome = householdIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalPersonalIncome = personalIncomes.reduce((sum, income) => sum + income.amount, 0);

  const householdBalance = totalHouseholdIncome - totalHouseholdExpenses;
  const personalBalance = totalPersonalIncome - totalPersonalExpenses;

  // Calculate member-specific totals
  const getMemberTotals = (memberId: string) => {
    const memberExpenses = expenses.filter(expense => expense.userId === memberId);
    const memberIncomes = incomes.filter(income => income.userId === memberId);
    
    return {
      expenses: memberExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      incomes: memberIncomes.reduce((sum, income) => sum + income.amount, 0),
    };
  };

  const getCategoryIcon = (categoryName: string, categories: Category[]) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return LucideIcons.MoreHorizontal;
    
    const IconComponent = (LucideIcons as any)[category.icon];
    return IconComponent || LucideIcons.MoreHorizontal;
  };

  const getCategoryColor = (categoryName: string, categories: Category[]) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6b7280';
  };

  const getUserName = () => {
    if (selectedMember) {
      const member = familyMembers.find(m => m.userId === selectedMember);
      return member?.nickname || member?.profile?.name || 'User';
    }
    return user?.nickname || user?.name || 'User';
  };

  const renderTransactionList = (
    transactions: (Expense | Income)[],
    type: 'expense' | 'income',
    categories: Category[]
  ) => {
    if (transactions.length === 0) {
      const emptyMessage = type === 'expense' 
        ? (activeView === 'household' ? t('joint.noHouseholdExpenses') : t('joint.noPersonalExpenses'))
        : (activeView === 'household' ? t('joint.noHouseholdIncome') : t('joint.noPersonalIncome'));
      
      const addMessage = type === 'expense'
        ? (activeView === 'household' ? t('joint.addHouseholdExpense') : t('joint.addPersonalExpense'))
        : (activeView === 'household' ? t('joint.addHouseholdIncome') : t('joint.addPersonalIncome'));

      return (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">{emptyMessage}</div>
          <p className="text-gray-500 dark:text-gray-400">{addMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const IconComponent = getCategoryIcon(transaction.category, categories);
          const categoryColor = getCategoryColor(transaction.category, categories);
          const isExpense = 'paidBy' in transaction;
          
          return (
            <div
              key={transaction.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${categoryColor}20` }}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: categoryColor }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {transaction.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category} • {formatDate(transaction.date)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {getUserName()}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isExpense 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {isExpense ? '' : '+'}
                      {formatCurrency(transaction.amount, currency, exchangeRates)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => isExpense ? onEditExpense(transaction as Expense) : onEditIncome(transaction as Income)}
                      className={`p-2 text-gray-400 rounded-lg transition-colors ${
                        isExpense 
                          ? 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                          : 'hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => isExpense ? onDeleteExpense(transaction.id) : onDeleteIncome(transaction.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('joint.title')}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={onAddExpense}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('expenses.addExpense')}</span>
          </button>
          <button
            onClick={onAddIncome}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('income.addIncome')}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Household Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('joint.totalHouseholdExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalHouseholdExpenses, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Home className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Household Income */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('joint.totalHouseholdIncome')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalHouseholdIncome, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Personal Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('joint.totalPersonalExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalPersonalExpenses, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Personal Income */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('joint.totalPersonalIncome')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalPersonalIncome, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Family Members Summary */}
      <FinancialCharts expenses={expenses} incomes={incomes} />

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sumar pe Membri Familie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => {
            const totals = getMemberTotals(member.userId);
            const balance = totals.incomes - totals.expenses;
            
            return (
              <div
                key={member.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedMember === member.userId
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedMember(selectedMember === member.userId ? null : member.userId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {member.nickname}
                  </h4>
                  {member.userId === user?.id && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                      Tu
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cheltuieli:</span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {formatCurrency(totals.expenses, currency, exchangeRates)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Venituri:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(totals.incomes, currency, exchangeRates)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-900 dark:text-white font-medium">Balanță:</span>
                    <span className={`font-bold ${
                      balance >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(balance, currency, exchangeRates)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedMember && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Afișezi tranzacțiile pentru: <strong>{getUserName()}</strong>
              <button
                onClick={() => setSelectedMember(null)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                (Anulează filtrul)
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('joint.householdBalance')}</p>
              <p className={`text-2xl font-bold ${householdBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(householdBalance, currency, exchangeRates)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${householdBalance >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              {householdBalance >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('joint.personalBalance')}</p>
              <p className={`text-2xl font-bold ${personalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(personalBalance, currency, exchangeRates)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${personalBalance >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              {personalBalance >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      {!selectedMember && (
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveView('household')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeView === 'household'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Gospodărie
            </button>
            <button
              onClick={() => setActiveView('personal')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeView === 'personal'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Personal
            </button>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedMember 
              ? `Cheltuieli - ${getUserName()}`
              : (activeView === 'household' ? 'Cheltuieli Gospodărie' : 'Cheltuieli Personale')
            }
          </h3>
          {renderTransactionList(
            filteredExpenses,
            'expense',
            expenseCategories
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedMember 
              ? `Venituri - ${getUserName()}`
              : (activeView === 'household' ? 'Venituri Gospodărie' : 'Venituri Personale')
            }
          </h3>
          {renderTransactionList(
            filteredIncomes,
            'income',
            incomeCategories
          )}
        </div>
      </div>
    </div>
  );
};

export default JointFinances;