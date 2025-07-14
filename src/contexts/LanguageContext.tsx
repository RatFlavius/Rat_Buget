import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ro';

export type Currency = 'USD' | 'RON' | 'EUR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: { [key: string]: number };
  updateExchangeRates: () => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    'header.title': 'R.A.T Budget',
    'header.subtitle': 'Manage your finances with ease',
    
    // Navigation
    'nav.expenses': 'Expenses',
    'nav.income': 'Income',
    'nav.statistics': 'Statistics',
    'nav.budgets': 'Budgets',
    'nav.tithes': 'Tithes',
    'nav.categories': 'Categories',
    'nav.joint': 'Joint Finances',
    
    // Summary Cards
    'summary.totalExpenses': 'Total Expenses',
    'summary.thisMonth': 'This Month',
    'summary.totalTransactions': 'Total Transactions',
    
    // Expenses
    'expenses.title': 'Recent Expenses',
    'expenses.addExpense': 'Add Expense',
    'expenses.searchPlaceholder': 'Search expenses...',
    'expenses.allCategories': 'All Categories',
    'expenses.sortByDate': 'Sort by Date',
    'expenses.sortByAmount': 'Sort by Amount',
    'expenses.sortByTitle': 'Sort by Title',
    'expenses.noExpensesFound': 'No expenses found',
    'expenses.tryAdjustingFilters': 'Try adjusting your filters',
    'expenses.addFirstExpense': 'Add your first expense to get started',
    
    // Expense Form
    'expenseForm.addNew': 'Add New Expense',
    'expenseForm.edit': 'Edit Expense',
    'expenseForm.title': 'Title',
    'expenseForm.titlePlaceholder': 'Enter expense title',
    'expenseForm.amount': 'Amount',
    'expenseForm.category': 'Category',
    'expenseForm.selectCategory': 'Select a category',
    'expenseForm.date': 'Date',
    'expenseForm.description': 'Description (optional)',
    'expenseForm.descriptionPlaceholder': 'Add a note about this expense...',
    'expenseForm.cancel': 'Cancel',
    'expenseForm.paidBy': 'Paid By',
    'expenseForm.paidByUser': 'Personal',
    'expenseForm.paidByHousehold': 'Household',
    'expenseForm.addExpense': 'Add Expense',
    'expenseForm.updateExpense': 'Update Expense',
    
    // Categories
    'category.foodDining': 'Food & Dining',
    'category.transportation': 'Transportation',
    'category.shopping': 'Shopping',
    'category.entertainment': 'Entertainment',
    'category.healthFitness': 'Health & Fitness',
    'category.education': 'Education',
    'category.billsUtilities': 'Bills & Utilities',
    'category.travel': 'Travel',
    'category.other': 'Other',
    
    // Income Categories
    'incomeCategory.salary': 'Salary',
    'incomeCategory.freelance': 'Freelance',
    'incomeCategory.business': 'Business',
    'incomeCategory.investments': 'Investments',
    'incomeCategory.rental': 'Rental Income',
    'incomeCategory.bonus': 'Bonus',
    'incomeCategory.refund': 'Refund',
    'incomeCategory.pension': 'Pension',
    'incomeCategory.other': 'Other',
    
    // Income
    'income.title': 'Recent Income',
    'income.addIncome': 'Add Income',
    'income.searchPlaceholder': 'Search income...',
    'income.allCategories': 'All Categories',
    'income.sortByDate': 'Sort by Date',
    'income.sortByAmount': 'Sort by Amount',
    'income.sortByTitle': 'Sort by Title',
    'income.noIncomeFound': 'No income found',
    'income.tryAdjustingFilters': 'Try adjusting your filters',
    'income.addFirstIncome': 'Add your first income to get started',
    
    // Income Form
    'incomeForm.addNew': 'Add New Income',
    'incomeForm.edit': 'Edit Income',
    'incomeForm.title': 'Title',
    'incomeForm.titlePlaceholder': 'Enter income title',
    'incomeForm.amount': 'Amount',
    'incomeForm.category': 'Category',
    'incomeForm.selectCategory': 'Select a category',
    'incomeForm.date': 'Date',
    'incomeForm.description': 'Description (optional)',
    'incomeForm.descriptionPlaceholder': 'Add a note about this income...',
    'incomeForm.cancel': 'Cancel',
    'incomeForm.earnedBy': 'Earned By',
    'incomeForm.earnedByUser': 'Personal',
    'incomeForm.earnedByHousehold': 'Household',
    'incomeForm.addIncome': 'Add Income',
    'incomeForm.updateIncome': 'Update Income',
    
    // Statistics
    'stats.totalExpenses': 'Total Expenses',
    'stats.totalIncome': 'Total Income',
    'stats.netIncome': 'Net Income',
    'stats.thisMonth': 'This Month',
    'stats.averagePerTransaction': 'Average per Transaction',
    'stats.totalTransactions': 'Total Transactions',
    'stats.topCategories': 'Top Categories',
    'stats.topIncomeCategories': 'Top Income Categories',
    
    // Budget Manager
    'budget.title': 'Budget Management',
    'budget.addBudget': 'Add Budget',
    'budget.category': 'Category',
    'budget.selectCategory': 'Select category',
    'budget.budgetAmount': 'Budget Amount',
    'budget.period': 'Period',
    'budget.weekly': 'Weekly',
    'budget.monthly': 'Monthly',
    'budget.yearly': 'Yearly',
    'budget.cancel': 'Cancel',
    'budget.noBudgetsSet': 'No budgets set',
    'budget.setBudgetsDescription': 'Set up budgets to track your spending goals',
    'budget.createFirstBudget': 'Create Your First Budget',
    'budget.remaining': 'Remaining',
    'budget.overBudget': 'Over budget',
    
    // Tithe Manager
    'tithe.title': 'Tithe Management',
    'tithe.setGoal': 'Set Goal',
    'tithe.addTithe': 'Add Tithe',
    'tithe.totalTithes': 'Total Tithes',
    'tithe.thisMonth': 'This Month',
    'tithe.givingPercentage': 'Giving Percentage',
    'tithe.goalProgress': 'Goal Progress',
    'tithe.noGoal': 'No Goal',
    'tithe.goalProgressTitle': 'Tithe Goal Progress',
    'tithe.target': 'Target',
    'tithe.addNewTithe': 'Add New Tithe',
    'tithe.editTithe': 'Edit Tithe',
    'tithe.amount': 'Amount',
    'tithe.date': 'Date',
    'tithe.recipient': 'Recipient',
    'tithe.recipientPlaceholder': 'Church, charity, organization...',
    'tithe.description': 'Description (optional)',
    'tithe.descriptionPlaceholder': 'Add a note about this tithe...',
    'tithe.updateTithe': 'Update Tithe',
    'tithe.setTitheGoal': 'Set Tithe Goal',
    'tithe.targetPercentage': 'Target Percentage',
    'tithe.titheHistory': 'Tithe History',
    'tithe.noTithesRecorded': 'No tithes recorded yet',
    
    // Authentication
    'auth.welcomeBack': 'Welcome back!',
    'auth.createAccount': 'Create your account',
    'auth.fullName': 'Full Name',
    'auth.enterName': 'Enter your full name',
    'auth.email': 'Email',
    'auth.enterEmail': 'Enter your email',
    'auth.password': 'Password',
    'auth.enterPassword': 'Enter your password',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.needAccount': "Don't have an account? Sign up",
    'auth.haveAccount': 'Already have an account? Sign in',
    'auth.tryDemo': 'Try Demo Account',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.userExists': 'User with this email already exists',
    'auth.nameRequired': 'Name is required',
    'auth.genericError': 'An error occurred. Please try again.',
    'auth.switchUser': 'Switch User',
    'auth.addFamilyMember': 'Add Family Member',
    'auth.addUser': 'Add User',
    'auth.enterSpouseName': 'Enter your spouse/family member name:',
    'auth.enterSpouseEmail': 'Enter their email:',
    'auth.enterSpousePassword': 'Enter a password for them:',
    'auth.spouseAccountCreated': 'Family member account created successfully!',
    
    // Categories
    'categories.expenseCategories': 'Expense Categories',
    'categories.incomeCategories': 'Income Categories',
    'categories.addCategory': 'Add Category',
    'categories.editCategory': 'Edit Category',
    'categories.addNewCategory': 'Add New Category',
    'categories.categoryName': 'Category Name',
    'categories.categoryNamePlaceholder': 'Enter category name',
    'categories.color': 'Color',
    'categories.icon': 'Icon',
    'categories.preview': 'Preview',
    'categories.updateCategory': 'Update Category',
    'categories.noCategoriesYet': 'No categories yet',
    'categories.createCategoriesDescription': 'Create custom categories to organize your expenses and income',
    'categories.createFirstCategory': 'Create Your First Category',
    
    // Joint Finances
    'joint.title': 'Joint Finances',
    'joint.householdExpenses': 'Household Expenses',
    'joint.householdIncome': 'Household Income',
    'joint.personalExpenses': 'Personal Expenses',
    'joint.personalIncome': 'Personal Income',
    'joint.totalHouseholdExpenses': 'Total Household Expenses',
    'joint.totalHouseholdIncome': 'Total Household Income',
    'joint.totalPersonalExpenses': 'Total Personal Expenses',
    'joint.totalPersonalIncome': 'Total Personal Income',
    'joint.householdBalance': 'Household Balance',
    'joint.personalBalance': 'Personal Balance',
    'joint.noHouseholdExpenses': 'No household expenses found',
    'joint.noHouseholdIncome': 'No household income found',
    'joint.noPersonalExpenses': 'No personal expenses found',
    'joint.noPersonalIncome': 'No personal income found',
    'joint.addHouseholdExpense': 'Add household expenses to track shared costs',
    'joint.addHouseholdIncome': 'Add household income to track shared earnings',
    'joint.addPersonalExpense': 'Add personal expenses to track individual costs',
    'joint.addPersonalIncome': 'Add personal income to track individual earnings',
    
    // Common
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    
    // Currency
    'currency.usd': 'USD',
    'currency.ron': 'RON',
    'currency.eur': 'EUR',
    'currency.switchCurrency': 'Switch Currency',
    'currency.updating': 'Updating rates...',
    'currency.lastUpdated': 'Rates updated',
  },
  ro: {
    // Header
    'header.title': 'R.A.T Budget',
    'header.subtitle': 'Gestionează-ți finanțele cu ușurință',
    
    // Navigation
    'nav.expenses': 'Cheltuieli',
    'nav.income': 'Venituri',
    'nav.statistics': 'Statistici',
    'nav.budgets': 'Bugete',
    'nav.tithes': 'Zeciuieli',
    'nav.categories': 'Categorii',
    'nav.joint': 'Finanțe Comune',
    
    // Summary Cards
    'summary.totalExpenses': 'Total Cheltuieli',
    'summary.thisMonth': 'Luna Aceasta',
    'summary.totalTransactions': 'Total Tranzacții',
    
    // Expenses
    'expenses.title': 'Cheltuieli Recente',
    'expenses.addExpense': 'Adaugă Cheltuială',
    'expenses.searchPlaceholder': 'Caută cheltuieli...',
    'expenses.allCategories': 'Toate Categoriile',
    'expenses.sortByDate': 'Sortează după Dată',
    'expenses.sortByAmount': 'Sortează după Sumă',
    'expenses.sortByTitle': 'Sortează după Titlu',
    'expenses.noExpensesFound': 'Nu s-au găsit cheltuieli',
    'expenses.tryAdjustingFilters': 'Încearcă să ajustezi filtrele',
    'expenses.addFirstExpense': 'Adaugă prima ta cheltuială pentru a începe',
    
    // Expense Form
    'expenseForm.addNew': 'Adaugă Cheltuială Nouă',
    'expenseForm.edit': 'Editează Cheltuiala',
    'expenseForm.title': 'Titlu',
    'expenseForm.titlePlaceholder': 'Introdu titlul cheltuielii',
    'expenseForm.amount': 'Sumă',
    'expenseForm.category': 'Categorie',
    'expenseForm.selectCategory': 'Selectează o categorie',
    'expenseForm.date': 'Data',
    'expenseForm.description': 'Descriere (opțional)',
    'expenseForm.descriptionPlaceholder': 'Adaugă o notă despre această cheltuială...',
    'expenseForm.cancel': 'Anulează',
    'expenseForm.paidBy': 'Plătit De',
    'expenseForm.paidByUser': 'Personal',
    'expenseForm.paidByHousehold': 'Gospodărie',
    'expenseForm.addExpense': 'Adaugă Cheltuială',
    'expenseForm.updateExpense': 'Actualizează Cheltuiala',
    
    // Categories
    'category.foodDining': 'Mâncare și Restaurante',
    'category.transportation': 'Transport',
    'category.shopping': 'Cumpărături',
    'category.entertainment': 'Divertisment',
    'category.healthFitness': 'Sănătate și Fitness',
    'category.education': 'Educație',
    'category.billsUtilities': 'Facturi și Utilități',
    'category.travel': 'Călătorii',
    'category.other': 'Altele',
    
    // Income Categories
    'incomeCategory.salary': 'Salariu',
    'incomeCategory.freelance': 'Freelancing',
    'incomeCategory.business': 'Afaceri',
    'incomeCategory.investments': 'Investiții',
    'incomeCategory.rental': 'Venituri din Închiriere',
    'incomeCategory.bonus': 'Bonus',
    'incomeCategory.refund': 'Rambursare',
    'incomeCategory.pension': 'Pensie',
    'incomeCategory.other': 'Altele',
    
    // Income
    'income.title': 'Venituri Recente',
    'income.addIncome': 'Adaugă Venit',
    'income.searchPlaceholder': 'Caută venituri...',
    'income.allCategories': 'Toate Categoriile',
    'income.sortByDate': 'Sortează după Dată',
    'income.sortByAmount': 'Sortează după Sumă',
    'income.sortByTitle': 'Sortează după Titlu',
    'income.noIncomeFound': 'Nu s-au găsit venituri',
    'income.tryAdjustingFilters': 'Încearcă să ajustezi filtrele',
    'income.addFirstIncome': 'Adaugă primul tău venit pentru a începe',
    
    // Income Form
    'incomeForm.addNew': 'Adaugă Venit Nou',
    'incomeForm.edit': 'Editează Venitul',
    'incomeForm.title': 'Titlu',
    'incomeForm.titlePlaceholder': 'Introdu titlul venitului',
    'incomeForm.amount': 'Sumă',
    'incomeForm.category': 'Categorie',
    'incomeForm.selectCategory': 'Selectează o categorie',
    'incomeForm.date': 'Data',
    'incomeForm.description': 'Descriere (opțional)',
    'incomeForm.descriptionPlaceholder': 'Adaugă o notă despre acest venit...',
    'incomeForm.cancel': 'Anulează',
    'incomeForm.earnedBy': 'Câștigat De',
    'incomeForm.earnedByUser': 'Personal',
    'incomeForm.earnedByHousehold': 'Gospodărie',
    'incomeForm.addIncome': 'Adaugă Venit',
    'incomeForm.updateIncome': 'Actualizează Venitul',
    
    // Statistics
    'stats.totalExpenses': 'Total Cheltuieli',
    'stats.totalIncome': 'Total Venituri',
    'stats.netIncome': 'Venit Net',
    'stats.thisMonth': 'Luna Aceasta',
    'stats.averagePerTransaction': 'Media pe Tranzacție',
    'stats.totalTransactions': 'Total Tranzacții',
    'stats.topCategories': 'Categorii Principale',
    'stats.topIncomeCategories': 'Categorii Principale de Venituri',
    
    // Budget Manager
    'budget.title': 'Gestionarea Bugetului',
    'budget.addBudget': 'Adaugă Buget',
    'budget.category': 'Categorie',
    'budget.selectCategory': 'Selectează categoria',
    'budget.budgetAmount': 'Suma Bugetului',
    'budget.period': 'Perioada',
    'budget.weekly': 'Săptămânal',
    'budget.monthly': 'Lunar',
    'budget.yearly': 'Anual',
    'budget.cancel': 'Anulează',
    'budget.noBudgetsSet': 'Nu sunt setate bugete',
    'budget.setBudgetsDescription': 'Configurează bugete pentru a-ți urmări obiectivele de cheltuieli',
    'budget.createFirstBudget': 'Creează Primul Tău Buget',
    'budget.remaining': 'Rămas',
    'budget.overBudget': 'Peste buget',
    
    // Tithe Manager
    'tithe.title': 'Gestionarea Zeciuielilor',
    'tithe.setGoal': 'Setează Obiectiv',
    'tithe.addTithe': 'Adaugă Zeciuială',
    'tithe.totalTithes': 'Total Zeciuieli',
    'tithe.thisMonth': 'Luna Aceasta',
    'tithe.givingPercentage': 'Procentul de Donație',
    'tithe.goalProgress': 'Progresul Obiectivului',
    'tithe.noGoal': 'Fără Obiectiv',
    'tithe.goalProgressTitle': 'Progresul Obiectivului de Zeciuială',
    'tithe.target': 'Țintă',
    'tithe.addNewTithe': 'Adaugă Zeciuială Nouă',
    'tithe.editTithe': 'Editează Zeciuiala',
    'tithe.amount': 'Sumă',
    'tithe.date': 'Data',
    'tithe.recipient': 'Destinatar',
    'tithe.recipientPlaceholder': 'Biserica, caritate, organizație...',
    'tithe.description': 'Descriere (opțional)',
    'tithe.descriptionPlaceholder': 'Adaugă o notă despre această zeciuială...',
    'tithe.updateTithe': 'Actualizează Zeciuiala',
    'tithe.setTitheGoal': 'Setează Obiectivul de Zeciuială',
    'tithe.targetPercentage': 'Procentul Țintă',
    'tithe.titheHistory': 'Istoricul Zeciuielilor',
    'tithe.noTithesRecorded': 'Nu sunt înregistrate zeciuieli încă',
    
    // Authentication
    'auth.welcomeBack': 'Bine ai revenit!',
    'auth.createAccount': 'Creează-ți contul',
    'auth.fullName': 'Nume Complet',
    'auth.enterName': 'Introdu numele complet',
    'auth.email': 'Email',
    'auth.enterEmail': 'Introdu email-ul',
    'auth.password': 'Parolă',
    'auth.enterPassword': 'Introdu parola',
    'auth.signIn': 'Conectează-te',
    'auth.signUp': 'Înregistrează-te',
    'auth.signOut': 'Deconectează-te',
    'auth.needAccount': 'Nu ai cont? Înregistrează-te',
    'auth.haveAccount': 'Ai deja cont? Conectează-te',
    'auth.tryDemo': 'Încearcă Contul Demo',
    'auth.invalidCredentials': 'Email sau parolă invalidă',
    'auth.userExists': 'Utilizatorul cu acest email există deja',
    'auth.nameRequired': 'Numele este obligatoriu',
    'auth.genericError': 'A apărut o eroare. Te rog încearcă din nou.',
    'auth.switchUser': 'Schimbă Utilizatorul',
    'auth.addFamilyMember': 'Adaugă Membru Familie',
    'auth.addUser': 'Adaugă Utilizator',
    'auth.enterSpouseName': 'Introdu numele soției/membrului familiei:',
    'auth.enterSpouseEmail': 'Introdu email-ul lor:',
    'auth.enterSpousePassword': 'Introdu o parolă pentru ei:',
    'auth.spouseAccountCreated': 'Contul membrului familiei a fost creat cu succes!',
    
    // Categories
    'categories.expenseCategories': 'Categorii de Cheltuieli',
    'categories.incomeCategories': 'Categorii de Venituri',
    'categories.addCategory': 'Adaugă Categorie',
    'categories.editCategory': 'Editează Categoria',
    'categories.addNewCategory': 'Adaugă Categorie Nouă',
    'categories.categoryName': 'Numele Categoriei',
    'categories.categoryNamePlaceholder': 'Introdu numele categoriei',
    'categories.color': 'Culoare',
    'categories.icon': 'Pictogramă',
    'categories.preview': 'Previzualizare',
    'categories.updateCategory': 'Actualizează Categoria',
    'categories.noCategoriesYet': 'Nu există categorii încă',
    'categories.createCategoriesDescription': 'Creează categorii personalizate pentru a-ți organiza cheltuielile și veniturile',
    'categories.createFirstCategory': 'Creează Prima Ta Categorie',
    
    // Joint Finances
    'joint.title': 'Finanțe Comune',
    'joint.householdExpenses': 'Cheltuieli Gospodărie',
    'joint.householdIncome': 'Venituri Gospodărie',
    'joint.personalExpenses': 'Cheltuieli Personale',
    'joint.personalIncome': 'Venituri Personale',
    'joint.totalHouseholdExpenses': 'Total Cheltuieli Gospodărie',
    'joint.totalHouseholdIncome': 'Total Venituri Gospodărie',
    'joint.totalPersonalExpenses': 'Total Cheltuieli Personale',
    'joint.totalPersonalIncome': 'Total Venituri Personale',
    'joint.householdBalance': 'Balanța Gospodăriei',
    'joint.personalBalance': 'Balanța Personală',
    'joint.noHouseholdExpenses': 'Nu s-au găsit cheltuieli de gospodărie',
    'joint.noHouseholdIncome': 'Nu s-au găsit venituri de gospodărie',
    'joint.noPersonalExpenses': 'Nu s-au găsit cheltuieli personale',
    'joint.noPersonalIncome': 'Nu s-au găsit venituri personale',
    'joint.addHouseholdExpense': 'Adaugă cheltuieli de gospodărie pentru a urmări costurile comune',
    'joint.addHouseholdIncome': 'Adaugă venituri de gospodărie pentru a urmări câștigurile comune',
    'joint.addPersonalExpense': 'Adaugă cheltuieli personale pentru a urmări costurile individuale',
    'joint.addPersonalIncome': 'Adaugă venituri personale pentru a urmări câștigurile individuale',
    
    // Common
    'common.cancel': 'Anulează',
    'common.save': 'Salvează',
    'common.edit': 'Editează',
    'common.delete': 'Șterge',
    'common.close': 'Închide',
    'common.loading': 'Se încarcă...',
    
    // Currency
    'currency.usd': 'USD',
    'currency.ron': 'LEI',
    'currency.eur': 'EUR',
    'currency.switchCurrency': 'Schimbă Moneda',
    'currency.updating': 'Actualizez cursurile...',
    'currency.lastUpdated': 'Cursuri actualizate',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ro');
  const [currency, setCurrency] = useState<Currency>('RON');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({
    USD: 1,
    EUR: 0.85,
    RON: 4.5
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedCurrency = localStorage.getItem('currency') as Currency;
    const savedRates = localStorage.getItem('exchangeRates');
    const lastUpdate = localStorage.getItem('ratesLastUpdate');
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ro')) {
      setLanguage(savedLanguage);
    } else {
      // Set Romanian as default if no saved language
      setLanguage('ro');
    }
    
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'RON' || savedCurrency === 'EUR')) {
      setCurrency(savedCurrency);
    } else {
      // Set RON as default if no saved currency
      setCurrency('RON');
    }
    
    if (savedRates) {
      setExchangeRates(JSON.parse(savedRates));
    }
    
    // Update rates if they're older than 1 hour or don't exist
    const oneHour = 60 * 60 * 1000;
    if (!lastUpdate || Date.now() - parseInt(lastUpdate) > oneHour) {
      updateExchangeRates();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const updateExchangeRates = async () => {
    try {
      // Using a free API for exchange rates
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      const newRates = {
        USD: 1,
        EUR: data.rates.EUR || 0.85,
        RON: data.rates.RON || 4.5
      };
      
      setExchangeRates(newRates);
      localStorage.setItem('exchangeRates', JSON.stringify(newRates));
      localStorage.setItem('ratesLastUpdate', Date.now().toString());
    } catch (error) {
      console.warn('Failed to update exchange rates, using cached rates');
      // Fallback to default rates if API fails
      const fallbackRates = {
        USD: 1,
        EUR: 0.85,
        RON: 4.5
      };
      setExchangeRates(fallbackRates);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      currency, 
      setCurrency, 
      exchangeRates,
      updateExchangeRates,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};