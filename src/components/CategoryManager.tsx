import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Palette, Save, X } from 'lucide-react';
import { Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import * as LucideIcons from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  type: 'expense' | 'income';
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  type
}) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    icon: 'MoreHorizontal'
  });

  const availableIcons = [
    'Utensils', 'Car', 'ShoppingBag', 'GameController2', 'Heart', 'GraduationCap',
    'Receipt', 'Plane', 'Home', 'Briefcase', 'Laptop', 'Building2', 'TrendingUp',
    'Gift', 'RotateCcw', 'Shield', 'Coffee', 'Music', 'Camera', 'Book',
    'Smartphone', 'Headphones', 'Shirt', 'Fuel', 'Stethoscope', 'Dumbbell',
    'PaintBucket', 'Wrench', 'MoreHorizontal'
  ];

  const predefinedColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#6b7280'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    console.log('CategoryManager: Submitting category', { formData, type });

    const categoryData = {
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon
    };

    if (editingCategory) {
      console.log('CategoryManager: Updating category');
      onUpdateCategory({ ...categoryData, id: editingCategory.id });
      setEditingCategory(null);
    } else {
      console.log('CategoryManager: Adding new category');
      onAddCategory(categoryData);
    }

    setFormData({ name: '', color: '#3b82f6', icon: 'MoreHorizontal' });
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#3b82f6', icon: 'MoreHorizontal' });
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.MoreHorizontal;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {type === 'expense' ? t('categories.expenseCategories') : t('categories.incomeCategories')}
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t('categories.addCategory')}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingCategory ? t('categories.editCategory') : t('categories.addNewCategory')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('categories.categoryName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('categories.categoryNamePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('categories.color')}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color 
                          ? 'border-gray-900 dark:border-white scale-110' 
                          : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('categories.icon')}
              </label>
              <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                {availableIcons.map((iconName) => {
                  const IconComponent = getIconComponent(iconName);
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-2 rounded-lg transition-all ${
                        formData.icon === iconName
                          ? 'bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <div 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {React.createElement(getIconComponent(formData.icon), {
                  className: "w-5 h-5",
                  style: { color: formData.color }
                })}
                <span className="text-gray-900 dark:text-white font-medium">
                  {formData.name || t('categories.preview')}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>{t('common.cancel')}</span>
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingCategory ? t('categories.updateCategory') : t('categories.addCategory')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          return (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.color}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('categories.noCategoriesYet')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('categories.createCategoriesDescription')}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('categories.createFirstCategory')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;