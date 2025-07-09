import React, { useState } from 'react';
import { Plus, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Budget, Expense, Category } from '../types';
import { calculateBudgetStatus, formatCurrency } from '../utils/calculations';
import { useLanguage } from '../contexts/LanguageContext';

interface BudgetManagerProps {
  budgets: Budget[];
  categories: Category[];
  expenses: Expense[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ 
  budgets, 
  categories,
  expenses, 
  onAddBudget, 
  onDeleteBudget 
}) => {
  const { t, currency, exchangeRates } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
  });

  const budgetStatus = calculateBudgetStatus(expenses, budgets);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    onAddBudget({
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period
    });

    setFormData({ category: '', amount: '', period: 'monthly' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('budget.title')}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t('budget.addBudget')}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">{t('budget.selectCategory')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.budgetAmount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.period')}
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="weekly">{t('budget.weekly')}</option>
                  <option value="monthly">{t('budget.monthly')}</option>
                  <option value="yearly">{t('budget.yearly')}</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('budget.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('budget.addBudget')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetStatus.map((budget) => (
          <div
            key={budget.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {budget.isOverBudget ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : budget.percentage > 80 ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {budget.category}
                </h3>
              </div>
              <button
                onClick={() => onDeleteBudget(budget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(budget.spent, currency, exchangeRates)} of {formatCurrency(budget.amount, currency, exchangeRates)}
                </span>
                <span className={`font-medium ${
                  budget.isOverBudget 
                    ? 'text-red-500' 
                    : budget.percentage > 80 
                      ? 'text-yellow-500' 
                      : 'text-green-500'
                }`}>
                  {budget.percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    budget.isOverBudget 
                      ? 'bg-red-500' 
                      : budget.percentage > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {budget.remaining >= 0 ? t('budget.remaining') : t('budget.overBudget')}: 
                  {formatCurrency(Math.abs(budget.remaining), currency, exchangeRates)}
                </span>
                <span className="capitalize">{budget.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {budgets.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('budget.noBudgetsSet')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('budget.setBudgetsDescription')}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('budget.createFirstBudget')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;