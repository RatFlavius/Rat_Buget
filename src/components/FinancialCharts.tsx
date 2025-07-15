import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { Expense, Income } from '../types';
import { formatCurrency } from '../utils/calculations';
import { useLanguage } from '../contexts/LanguageContext';

interface FinancialChartsProps {
  expenses: Expense[];
  incomes: Income[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ expenses, incomes }) => {
  const { currency, exchangeRates } = useLanguage();

  // Calculate current month data
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
  
  const monthlyExpensesTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncomesTotal = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyBalance = monthlyIncomesTotal - monthlyExpensesTotal;
  
  // Calculate yearly data
  const yearlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === currentYear;
  });
  
  const yearlyIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getFullYear() === currentYear;
  });
  
  const yearlyExpensesTotal = yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const yearlyIncomesTotal = yearlyIncomes.reduce((sum, income) => sum + income.amount, 0);
  const yearlyBalance = yearlyIncomesTotal - yearlyExpensesTotal;

  // Calculate percentages for visual bars
  const monthlyMaxAmount = Math.max(monthlyExpensesTotal, monthlyIncomesTotal);
  const monthlyExpensePercentage = monthlyMaxAmount > 0 ? (monthlyExpensesTotal / monthlyMaxAmount) * 100 : 0;
  const monthlyIncomePercentage = monthlyMaxAmount > 0 ? (monthlyIncomesTotal / monthlyMaxAmount) * 100 : 0;

  const yearlyMaxAmount = Math.max(yearlyExpensesTotal, yearlyIncomesTotal);
  const yearlyExpensePercentage = yearlyMaxAmount > 0 ? (yearlyExpensesTotal / yearlyMaxAmount) * 100 : 0;
  const yearlyIncomePercentage = yearlyMaxAmount > 0 ? (yearlyIncomesTotal / yearlyMaxAmount) * 100 : 0;

  const monthName = new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Monthly Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Comparație Financiară - {monthName}</span>
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            monthlyBalance >= 0 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            Balanță: {formatCurrency(monthlyBalance, currency, exchangeRates)}
          </div>
        </div>

        <div className="space-y-4">
          {/* Monthly Income Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Venituri</span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {formatCurrency(monthlyIncomesTotal, currency, exchangeRates)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${monthlyIncomePercentage}%` }}
              >
                {monthlyIncomePercentage > 20 && (
                  <span className="text-xs font-medium text-white">
                    {monthlyIncomePercentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Expense Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cheltuieli</span>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {formatCurrency(monthlyExpensesTotal, currency, exchangeRates)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${monthlyExpensePercentage}%` }}
              >
                {monthlyExpensePercentage > 20 && (
                  <span className="text-xs font-medium text-white">
                    {monthlyExpensePercentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Diferența:</span>
            <span className={`font-bold ${
              monthlyBalance >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {monthlyBalance >= 0 ? '+' : ''}{formatCurrency(monthlyBalance, currency, exchangeRates)}
            </span>
          </div>
          {monthlyIncomesTotal > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Rata de economisire:</span>
              <span className={`font-medium ${
                monthlyBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {((monthlyBalance / monthlyIncomesTotal) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Yearly Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Comparație Financiară - Anul {currentYear}</span>
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            yearlyBalance >= 0 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            Balanță: {formatCurrency(yearlyBalance, currency, exchangeRates)}
          </div>
        </div>

        <div className="space-y-4">
          {/* Yearly Income Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Venituri Anuale</span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {formatCurrency(yearlyIncomesTotal, currency, exchangeRates)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${yearlyIncomePercentage}%` }}
              >
                {yearlyIncomePercentage > 20 && (
                  <span className="text-xs font-medium text-white">
                    {yearlyIncomePercentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Yearly Expense Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cheltuieli Anuale</span>
              </div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {formatCurrency(yearlyExpensesTotal, currency, exchangeRates)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${yearlyExpensePercentage}%` }}
              >
                {yearlyExpensePercentage > 20 && (
                  <span className="text-xs font-medium text-white">
                    {yearlyExpensePercentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Summary */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Diferența anuală:</span>
            <span className={`font-bold ${
              yearlyBalance >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {yearlyBalance >= 0 ? '+' : ''}{formatCurrency(yearlyBalance, currency, exchangeRates)}
            </span>
          </div>
          {yearlyIncomesTotal > 0 && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Rata de economisire anuală:</span>
              <span className={`font-medium ${
                yearlyBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {((yearlyBalance / yearlyIncomesTotal) * 100).toFixed(1)}%
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Media lunară cheltuieli:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatCurrency(yearlyExpensesTotal / 12, currency, exchangeRates)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Media lunară venituri:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatCurrency(yearlyIncomesTotal / 12, currency, exchangeRates)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {currentMonthExpenses.length + currentMonthIncomes.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tranzacții luna aceasta</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {yearlyExpenses.length + yearlyIncomes.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tranzacții anul acesta</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {currentMonthExpenses.length > 0 ? (monthlyExpensesTotal / currentMonthExpenses.length).toFixed(0) : '0'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Media pe tranzacție (RON)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;