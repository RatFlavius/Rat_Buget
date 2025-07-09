import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Expense, Income, Category } from '../types';
import { calculateTotalExpenses, calculateTotalIncome, calculateExpensesByCategory, calculateIncomeByCategory, formatCurrency } from '../utils/calculations';
import { useLanguage } from '../contexts/LanguageContext';

interface StatisticsProps {
  expenses: Expense[];
  incomes: Income[];
  expenseCategories: Category[];
  incomeCategories: Category[];
}

const Statistics: React.FC<StatisticsProps> = ({ expenses, incomes, expenseCategories, incomeCategories }) => {
  const { t, currency, exchangeRates } = useLanguage();
  const totalExpenses = calculateTotalExpenses(expenses);
  const totalIncome = calculateTotalIncome(incomes);
  const netIncome = totalIncome - totalExpenses;
  const categoryTotals = calculateExpensesByCategory(expenses);
  const incomeCategoryTotals = calculateIncomeByCategory(incomes);
  
  // Get current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const currentMonthIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });
  
  // Get previous month expenses
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
  });
  
  const currentMonthTotal = calculateTotalExpenses(currentMonthExpenses);
  const currentMonthIncomeTotal = calculateTotalIncome(currentMonthIncomes);
  const prevMonthTotal = calculateTotalExpenses(prevMonthExpenses);
  const monthlyChange = currentMonthTotal - prevMonthTotal;
  const monthlyChangePercent = prevMonthTotal > 0 ? (monthlyChange / prevMonthTotal) * 100 : 0;
  
  const averageDaily = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      name: category,
      amount,
      color: expenseCategories.find(cat => cat.name === category)?.color || '#6b7280'
    }));

  const topIncomeCategories = Object.entries(incomeCategoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      name: category,
      amount,
      color: incomeCategories.find(cat => cat.name === category)?.color || '#6b7280'
    }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.totalExpenses')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalExpenses, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.totalIncome')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalIncome, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.netIncome')}</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(netIncome, currency, exchangeRates)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${netIncome >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              <DollarSign className={`w-6 h-6 ${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.thisMonth')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(currentMonthIncomeTotal - currentMonthTotal, currency, exchangeRates)}
              </p>
              <div className="flex items-center mt-2">
                {monthlyChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                )}
                <span className={`text-sm ${monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Math.abs(monthlyChangePercent).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.averagePerTransaction')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(averageDaily, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('stats.topCategories')} (Expenses)
          </h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => {
              const percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[80px] text-right">
                      {formatCurrency(category.amount, currency, exchangeRates)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('stats.topIncomeCategories')}
          </h3>
          <div className="space-y-4">
            {topIncomeCategories.map((category, index) => {
              const percentage = totalIncome > 0 ? (category.amount / totalIncome) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[80px] text-right">
                      {formatCurrency(category.amount, currency, exchangeRates)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;