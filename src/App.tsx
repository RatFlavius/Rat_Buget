import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Target, List, Heart, TrendingUp } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { useSupabaseData } from './hooks/useSupabaseData';
import { Expense, Income, Budget, Tithe, TitheGoal, Category } from './types';
import { Header } from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import Statistics from './components/Statistics';
import BudgetManager from './components/BudgetManager';
import TitheManager from './components/TitheManager';
import CategoryManager from './components/CategoryManager';
import { formatCurrency, calculateTotalIncome } from './utils/calculations';
import { getDefaultCategories, getIncomeCategories } from './data/categories';
import SupabaseAuth from './components/SupabaseAuth';
import JointFinances from './components/JointFinances';
import { Home, AlertCircle } from 'lucide-react';

// Simple Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">R.A.T Budget</h2>
      <p className="text-gray-600 dark:text-gray-400">Se încarcă aplicația...</p>
    </div>
  </div>
);

// Simple Error component
const ErrorScreen = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Eroare</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Încearcă din nou
      </button>
    </div>
  </div>
);

function MainApplicationContent() {
  const { t, currency, exchangeRates } = useLanguage();
  const { user } = useSupabaseAuth();
  
  // Use Supabase for data storage
  const {
    expenses = [],
    incomes = [],
    budgets = [],
    tithes = [],
    titheGoals = [],
    expenseCategories = [],
    incomeCategories = [],
    loading,
    error: dataError,
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
  } = useSupabaseData(user?.id);
  
  const [activeTab, setActiveTab] = useState<'expenses' | 'income' | 'statistics' | 'budgets' | 'tithes' | 'categories' | 'joint'>('joint');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Show error if data loading failed
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Eroare la încărcarea datelor</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reîncarcă aplicația
          </button>
        </div>
      </div>
    );
  }

  // Initialize default categories if none exist
  useEffect(() => {
    if (user && !loading && expenseCategories.length === 0 && addExpenseCategory) {
      const defaultExpenseCategories = getDefaultCategories(t);
      defaultExpenseCategories.forEach(category => {
        addExpenseCategory(category).catch(console.error);
      });
    }

    if (user && !loading && incomeCategories.length === 0 && addIncomeCategory) {
      const defaultIncomeCategories = getIncomeCategories(t);
      defaultIncomeCategories.forEach(category => {
        addIncomeCategory(category).catch(console.error);
      });
    }
  }, [user, loading, expenseCategories.length, incomeCategories.length, t, addExpenseCategory, addIncomeCategory]);

  const handleEditTithe = (tithe: Tithe) => {
    if (updateTithe) {
      updateTithe(tithe).catch(console.error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleFormSubmit = (expenseData: Omit<Expense, 'id'>) => {
    if (!user || !addExpense || !updateExpense) return;
    
    if (editingExpense) {
      updateExpense({ ...expenseData, id: editingExpense.id, userId: user.id }).catch(console.error);
      setEditingExpense(null);
    } else {
      addExpense({ ...expenseData, userId: user.id }).catch(console.error);
    }
  };

  const handleIncomeFormSubmit = (incomeData: Omit<Income, 'id'>) => {
    if (!user || !addIncome || !updateIncome) return;
    
    if (editingIncome) {
      updateIncome({ ...incomeData, id: editingIncome.id, userId: user.id }).catch(console.error);
      setEditingIncome(null);
    } else {
      addIncome({ ...incomeData, userId: user.id }).catch(console.error);
    }
  };

  const handleFormClose = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleIncomeFormClose = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = calculateTotalIncome(incomes);
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Calculate current month totals
  const currentMonthNumber = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonthNumber && expenseDate.getFullYear() === currentYear;
  });
  
  const currentMonthIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() === currentMonthNumber && incomeDate.getFullYear() === currentYear;
  });
  
  const currentMonthExpensesTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthIncomesTotal = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  
  // Calculate yearly totals
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error boundary pentru debugging
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Nu ești autentificat</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'joint', label: t('nav.joint'), icon: Home },
    { id: 'expenses', label: t('nav.expenses'), icon: List },
    { id: 'income', label: t('nav.income'), icon: TrendingUp },
    { id: 'statistics', label: t('nav.statistics'), icon: BarChart3 },
    { id: 'budgets', label: t('nav.budgets'), icon: Target },
    { id: 'tithes', label: t('nav.tithes'), icon: Heart },
    { id: 'categories', label: t('nav.categories'), icon: List }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Cheltuieli</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentMonthExpensesTotal, currency, exchangeRates)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Venituri</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentMonthIncomesTotal, currency, exchangeRates)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cheltuieli Anul {currentYear}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlyExpensesTotal, currency, exchangeRates)}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Venituri Anul {currentYear}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(yearlyIncomesTotal, currency, exchangeRates)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('expenses.title')}
                  </h2>
                  <button
                    onClick={() => setShowExpenseForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('expenses.addExpense')}</span>
                  </button>
                </div>
                
                <ExpenseList
                  expenses={expenses}
                  categories={expenseCategories}
                  onDeleteExpense={deleteExpense || (() => {})}
                  onEditExpense={handleEditExpense}
                />
              </div>
            )}

            {activeTab === 'income' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('income.title')}
                  </h2>
                  <button
                    onClick={() => setShowIncomeForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('income.addIncome')}</span>
                  </button>
                </div>
                
                <IncomeList
                  incomes={incomes}
                  categories={incomeCategories}
                  onDeleteIncome={deleteIncome || (() => {})}
                  onEditIncome={handleEditIncome}
                />
              </div>
            )}

            {activeTab === 'statistics' && (
              <Statistics 
                expenses={expenses} 
                incomes={incomes}
                expenseCategories={expenseCategories}
                incomeCategories={incomeCategories}
              />
            )}

            {activeTab === 'budgets' && budgets && addBudget && deleteBudget && (
              <BudgetManager
                budgets={budgets}
                categories={expenseCategories}
                expenses={expenses}
                onAddBudget={addBudget}
                onDeleteBudget={deleteBudget}
              />
            )}

            {activeTab === 'tithes' && tithes && titheGoals && addTithe && deleteTithe && addTitheGoal && deleteTitheGoal && (
              <TitheManager
                tithes={tithes}
                titheGoals={titheGoals}
                expenses={expenses}
                onAddTithe={addTithe}
                onDeleteTithe={deleteTithe}
                onEditTithe={handleEditTithe}
                onAddTitheGoal={addTitheGoal}
                onDeleteTitheGoal={deleteTitheGoal}
              />
            )}

            {activeTab === 'categories' && (
              <div className="space-y-8">
                {addExpenseCategory && updateExpenseCategory && deleteExpenseCategory && (
                  <CategoryManager
                    categories={expenseCategories}
                    onAddCategory={addExpenseCategory}
                    onUpdateCategory={updateExpenseCategory}
                    onDeleteCategory={deleteExpenseCategory}
                    type="expense"
                  />
                )}
                {addIncomeCategory && updateIncomeCategory && deleteIncomeCategory && (
                  <CategoryManager
                    categories={incomeCategories}
                    onAddCategory={addIncomeCategory}
                    onUpdateCategory={updateIncomeCategory}
                    onDeleteCategory={deleteIncomeCategory}
                    type="income"
                  />
                )}
              </div>
            )}

            {activeTab === 'joint' && deleteExpense && deleteIncome && (
              <JointFinances
                expenses={expenses}
                incomes={incomes}
                expenseCategories={expenseCategories}
                incomeCategories={incomeCategories}
                onAddExpense={() => setShowExpenseForm(true)}
                onAddIncome={() => setShowIncomeForm(true)}
                onEditExpense={handleEditExpense}
                onEditIncome={handleEditIncome}
                onDeleteExpense={deleteExpense}
                onDeleteIncome={deleteIncome}
              />
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <ExpenseForm
          isOpen={showExpenseForm}
          categories={expenseCategories}
          onClose={handleFormClose}
          onAddExpense={handleFormSubmit}
          editingExpense={editingExpense}
        />
      )}

      {/* Income Form Modal */}
      {showIncomeForm && (
        <IncomeForm
          isOpen={showIncomeForm}
          categories={incomeCategories}
          onClose={handleIncomeFormClose}
          onAddIncome={handleIncomeFormSubmit}
          editingIncome={editingIncome}
        />
      )}
    </div>
  );
}

function AuthGate() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Application error:', event.error);
      setError('A apărut o eroare neașteptată. Te rog reîncarcă pagina.');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError('A apărut o eroare de conexiune. Verifică conexiunea la internet.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    return <ErrorScreen error={error} onRetry={handleRetry} />;
  }

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <SupabaseAuth />;
  }

  return <MainApplicationContent />;
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthGate />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;