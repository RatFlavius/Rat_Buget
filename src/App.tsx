import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Target, List, Heart, TrendingUp } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Expense, Income, Budget, Tithe, TitheGoal, Category } from './types';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeForm from './components/IncomeForm';
import IncomeList from './components/IncomeList';
import Statistics from './components/Statistics';
import BudgetManager from './components/BudgetManager';
import TitheManager from './components/TitheManager';
import JointFinances from './components/JointFinances';
import CategoryManager from './components/CategoryManager';
import { formatCurrency, calculateTotalIncome } from './utils/calculations';
import { getDefaultCategories, getIncomeCategories } from './data/categories';
import LoginForm from './components/LoginForm';

function MainApplicationContent() {
  const { t, currency, exchangeRates } = useLanguage();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [titheGoals, setTitheGoals] = useState<TitheGoal[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'expenses' | 'income' | 'statistics' | 'budgets' | 'tithes' | 'categories' | 'joint'>('expenses');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Create user-specific localStorage keys
  const getUserKey = (key: string) => `${key}_${user!.id}`;

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(getUserKey('expenses'));
    const savedIncomes = localStorage.getItem(getUserKey('incomes'));
    const savedBudgets = localStorage.getItem(getUserKey('budgets'));
    const savedTithes = localStorage.getItem(getUserKey('tithes'));
    const savedTitheGoals = localStorage.getItem(getUserKey('titheGoals'));
    const savedExpenseCategories = localStorage.getItem(getUserKey('expenseCategories'));
    const savedIncomeCategories = localStorage.getItem(getUserKey('incomeCategories'));
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    if (savedTithes) {
      setTithes(JSON.parse(savedTithes));
    }
    if (savedTitheGoals) {
      setTitheGoals(JSON.parse(savedTitheGoals));
    }
    
    // Initialize categories with defaults if none exist
    if (savedExpenseCategories) {
      setExpenseCategories(JSON.parse(savedExpenseCategories));
    } else {
      const defaultExpenseCategories = getDefaultCategories(t);
      setExpenseCategories(defaultExpenseCategories);
    }
    
    if (savedIncomeCategories) {
      setIncomeCategories(JSON.parse(savedIncomeCategories));
    } else {
      const defaultIncomeCategories = getIncomeCategories(t);
      setIncomeCategories(defaultIncomeCategories);
    }
  }, [user!.id, t]);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(getUserKey('expenses'), JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(getUserKey('incomes'), JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem(getUserKey('budgets'), JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(getUserKey('tithes'), JSON.stringify(tithes));
  }, [tithes]);

  useEffect(() => {
    localStorage.setItem(getUserKey('titheGoals'), JSON.stringify(titheGoals));
  }, [titheGoals]);

  useEffect(() => {
    localStorage.setItem(getUserKey('expenseCategories'), JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem(getUserKey('incomeCategories'), JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      userId: user!.id
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const addIncome = (incomeData: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...incomeData,
      id: Date.now().toString(),
      userId: user!.id
    };
    setIncomes(prev => [newIncome, ...prev]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const updateIncome = (updatedIncome: Income) => {
    setIncomes(prev => prev.map(income => 
      income.id === updatedIncome.id ? updatedIncome : income
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  const addBudget = (budgetData: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  const addTithe = (titheData: Omit<Tithe, 'id'>) => {
    const newTithe: Tithe = {
      ...titheData,
      id: Date.now().toString()
    };
    setTithes(prev => [newTithe, ...prev]);
  };

  const updateTithe = (updatedTithe: Tithe) => {
    setTithes(prev => prev.map(tithe => 
      tithe.id === updatedTithe.id ? updatedTithe : tithe
    ));
  };

  const deleteTithe = (id: string) => {
    setTithes(prev => prev.filter(tithe => tithe.id !== id));
  };

  const addTitheGoal = (goalData: Omit<TitheGoal, 'id'>) => {
    const newGoal: TitheGoal = {
      ...goalData,
      id: Date.now().toString()
    };
    setTitheGoals(prev => [...prev, newGoal]);
  };

  const deleteTitheGoal = (id: string) => {
    setTitheGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const addExpenseCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };
    setExpenseCategories(prev => [...prev, newCategory]);
  };

  const updateExpenseCategory = (updatedCategory: Category) => {
    setExpenseCategories(prev => prev.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const deleteExpenseCategory = (id: string) => {
    setExpenseCategories(prev => prev.filter(category => category.id !== id));
  };

  const addIncomeCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };
    setIncomeCategories(prev => [...prev, newCategory]);
  };

  const updateIncomeCategory = (updatedCategory: Category) => {
    setIncomeCategories(prev => prev.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const deleteIncomeCategory = (id: string) => {
    setIncomeCategories(prev => prev.filter(category => category.id !== id));
  };

  const handleEditTithe = (tithe: Tithe) => {
    updateTithe(tithe);
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
    if (editingExpense) {
      updateExpense({ ...expenseData, id: editingExpense.id });
      setEditingExpense(null);
    } else {
      addExpense(expenseData);
    }
  };

  const handleIncomeFormSubmit = (incomeData: Omit<Income, 'id'>) => {
    if (editingIncome) {
      updateIncome({ ...incomeData, id: editingIncome.id });
      setEditingIncome(null);
    } else {
      addIncome(incomeData);
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
  const netIncome = totalIncome - totalExpenses;
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const tabs = [
    { id: 'expenses', label: t('nav.expenses'), icon: List },
    { id: 'income', label: t('nav.income'), icon: TrendingUp },
    { id: 'statistics', label: t('nav.statistics'), icon: BarChart3 },
    { id: 'budgets', label: t('nav.budgets'), icon: Target },
    { id: 'tithes', label: t('nav.tithes'), icon: Heart },
    { id: 'categories', label: t('nav.categories'), icon: List },
    { id: 'joint', label: t('nav.joint'), icon: TrendingUp }
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('summary.totalExpenses')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalExpenses, currency, exchangeRates)}
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

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.netIncome')}</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(netIncome, currency, exchangeRates)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${netIncome >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <Target className={`w-6 h-6 ${netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('summary.thisMonth')}</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentMonth}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <List className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                  onDeleteExpense={deleteExpense}
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
                  onDeleteIncome={deleteIncome}
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

            {activeTab === 'budgets' && (
              <BudgetManager
                budgets={budgets}
                categories={expenseCategories}
                expenses={expenses}
                onAddBudget={addBudget}
                onDeleteBudget={deleteBudget}
              />
            )}

            {activeTab === 'tithes' && (
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
                <CategoryManager
                  categories={expenseCategories}
                  onAddCategory={addExpenseCategory}
                  onUpdateCategory={updateExpenseCategory}
                  onDeleteCategory={deleteExpenseCategory}
                  type="expense"
                />
                <CategoryManager
                  categories={incomeCategories}
                  onAddCategory={addIncomeCategory}
                  onUpdateCategory={updateIncomeCategory}
                  onDeleteCategory={deleteIncomeCategory}
                  type="income"
                />
              </div>
            )}

            {activeTab === 'joint' && (
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
      <ExpenseForm
        isOpen={showExpenseForm}
        categories={expenseCategories}
        onClose={handleFormClose}
        onAddExpense={handleFormSubmit}
        editingExpense={editingExpense}
      />

      {/* Income Form Modal */}
      <IncomeForm
        isOpen={showIncomeForm}
        categories={incomeCategories}
        onClose={handleIncomeFormClose}
        onAddIncome={handleIncomeFormSubmit}
        editingIncome={editingIncome}
      />
    </div>
  );
}

function AuthGate() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return <MainApplicationContent />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthGate />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;