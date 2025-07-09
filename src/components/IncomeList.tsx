import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit3 } from 'lucide-react';
import { Income, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { useLanguage } from '../contexts/LanguageContext';
import * as LucideIcons from 'lucide-react';

interface IncomeListProps {
  incomes: Income[];
  categories: Category[];
  onDeleteIncome: (id: string) => void;
  onEditIncome: (income: Income) => void;
}

const IncomeList: React.FC<IncomeListProps> = ({ incomes, categories, onDeleteIncome, onEditIncome }) => {
  const { t, currency, exchangeRates } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return LucideIcons.MoreHorizontal;
    
    const IconComponent = (LucideIcons as any)[category.icon];
    return IconComponent || LucideIcons.MoreHorizontal;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6b7280';
  };

  const filteredIncomes = incomes
    .filter(income => {
      const matchesSearch = income.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           income.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || income.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('income.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">{t('income.allCategories')}</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="date">{t('income.sortByDate')}</option>
          <option value="amount">{t('income.sortByAmount')}</option>
          <option value="title">{t('income.sortByTitle')}</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredIncomes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">{t('income.noIncomeFound')}</div>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory ? t('income.tryAdjustingFilters') : t('income.addFirstIncome')}
            </p>
          </div>
        ) : (
          filteredIncomes.map((income) => {
            const IconComponent = getCategoryIcon(income.category);
            const categoryColor = getCategoryColor(income.category);
            
            return (
              <div
                key={income.id}
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
                        {income.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {income.category} • {formatDate(income.date)}
                      </p>
                      {income.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {income.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        +{formatCurrency(income.amount, currency, exchangeRates)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onEditIncome(income)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteIncome(income.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IncomeList;