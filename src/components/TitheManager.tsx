import React, { useState } from 'react';
import { Plus, Heart, Target, TrendingUp, Calendar, Edit3, Trash2 } from 'lucide-react';
import { Tithe, TitheGoal, Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { useLanguage } from '../contexts/LanguageContext';

interface TitheManagerProps {
  tithes: Tithe[];
  titheGoals: TitheGoal[];
  expenses: Expense[];
  onAddTithe: (tithe: Omit<Tithe, 'id'>) => void;
  onDeleteTithe: (id: string) => void;
  onEditTithe: (tithe: Tithe) => void;
  onAddTitheGoal: (goal: Omit<TitheGoal, 'id'>) => void;
  onDeleteTitheGoal: (id: string) => void;
}

const TitheManager: React.FC<TitheManagerProps> = ({
  tithes,
  titheGoals,
  expenses,
  onAddTithe,
  onDeleteTithe,
  onEditTithe,
  onAddTitheGoal,
  onDeleteTitheGoal
}) => {
  const { t, currency, exchangeRates } = useLanguage();
  const [showTitheForm, setShowTitheForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingTithe, setEditingTithe] = useState<Tithe | null>(null);
  const [titheFormData, setTitheFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    recipient: ''
  });
  const [goalFormData, setGoalFormData] = useState({
    targetPercentage: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
  });

  // Calculate tithe statistics
  const totalTithes = tithes.reduce((sum, tithe) => sum + tithe.amount, 0);
  const totalIncome = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentTithePercentage = totalIncome > 0 ? (totalTithes / totalIncome) * 100 : 0;

  // Get current period data
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTithes = tithes.filter(tithe => {
    const titheDate = new Date(tithe.date);
    return titheDate.getMonth() === currentMonth && titheDate.getFullYear() === currentYear;
  });
  const currentMonthTotal = currentMonthTithes.reduce((sum, tithe) => sum + tithe.amount, 0);

  const activeGoal = titheGoals.find(goal => goal.isActive);
  const goalProgress = activeGoal ? (currentTithePercentage / activeGoal.targetPercentage) * 100 : 0;

  const handleTitheSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titheFormData.amount || !titheFormData.recipient) return;

    const titheData = {
      amount: parseFloat(titheFormData.amount),
      date: titheFormData.date,
      description: titheFormData.description,
      recipient: titheFormData.recipient
    };

    if (editingTithe) {
      onEditTithe({ ...titheData, id: editingTithe.id });
      setEditingTithe(null);
    } else {
      onAddTithe(titheData);
    }

    setTitheFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      recipient: ''
    });
    setShowTitheForm(false);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalFormData.targetPercentage) return;

    // Deactivate existing goals
    titheGoals.forEach(goal => {
      if (goal.isActive) {
        onDeleteTitheGoal(goal.id);
      }
    });

    onAddTitheGoal({
      targetPercentage: parseFloat(goalFormData.targetPercentage),
      period: goalFormData.period,
      isActive: true
    });

    setGoalFormData({
      targetPercentage: '',
      period: 'monthly'
    });
    setShowGoalForm(false);
  };

  const handleEditTithe = (tithe: Tithe) => {
    setEditingTithe(tithe);
    setTitheFormData({
      amount: tithe.amount.toString(),
      date: tithe.date,
      description: tithe.description || '',
      recipient: tithe.recipient
    });
    setShowTitheForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('tithe.title')}
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowGoalForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>{t('tithe.setGoal')}</span>
          </button>
          <button
            onClick={() => setShowTitheForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('tithe.addTithe')}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('tithe.totalTithes')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalTithes, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('tithe.thisMonth')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentMonthTotal, currency, exchangeRates)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('tithe.givingPercentage')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTithePercentage.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('tithe.goalProgress')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeGoal ? `${goalProgress.toFixed(1)}%` : t('tithe.noGoal')}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      {activeGoal && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('tithe.goalProgressTitle')}
            </h3>
            <button
              onClick={() => onDeleteTitheGoal(activeGoal.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {t('tithe.target')}: {activeGoal.targetPercentage}% ({activeGoal.period})
              </span>
              <span className={`font-medium ${
                goalProgress >= 100 ? 'text-green-500' : goalProgress >= 80 ? 'text-yellow-500' : 'text-blue-500'
              }`}>
                {goalProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  goalProgress >= 100 ? 'bg-green-500' : goalProgress >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showTitheForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingTithe ? t('tithe.editTithe') : t('tithe.addNewTithe')}
          </h3>
          <form onSubmit={handleTitheSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tithe.amount')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={titheFormData.amount}
                  onChange={(e) => setTitheFormData({ ...titheFormData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tithe.date')}
                </label>
                <input
                  type="date"
                  value={titheFormData.date}
                  onChange={(e) => setTitheFormData({ ...titheFormData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tithe.recipient')}
              </label>
              <input
                type="text"
                value={titheFormData.recipient}
                onChange={(e) => setTitheFormData({ ...titheFormData, recipient: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('tithe.recipientPlaceholder')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('tithe.description')}
              </label>
              <textarea
                value={titheFormData.description}
                onChange={(e) => setTitheFormData({ ...titheFormData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder={t('tithe.descriptionPlaceholder')}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowTitheForm(false);
                  setEditingTithe(null);
                  setTitheFormData({
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    recipient: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTithe ? t('tithe.updateTithe') : t('tithe.addTithe')}
              </button>
            </div>
          </form>
        </div>
      )}

      {showGoalForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('tithe.setTitheGoal')}
          </h3>
          <form onSubmit={handleGoalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('tithe.targetPercentage')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={goalFormData.targetPercentage}
                  onChange={(e) => setGoalFormData({ ...goalFormData, targetPercentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10.0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('budget.period')}
                </label>
                <select
                  value={goalFormData.period}
                  onChange={(e) => setGoalFormData({ ...goalFormData, period: e.target.value as any })}
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
                onClick={() => setShowGoalForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t('tithe.setGoal')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tithe History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('tithe.titheHistory')}
        </h3>
        <div className="space-y-2">
          {tithes.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{t('tithe.noTithesRecorded')}</p>
            </div>
          ) : (
            tithes
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((tithe) => (
                <div
                  key={tithe.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {tithe.recipient}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(tithe.date)}
                      </p>
                      {tithe.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {tithe.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(tithe.amount, currency, exchangeRates)}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditTithe(tithe)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTithe(tithe.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TitheManager;