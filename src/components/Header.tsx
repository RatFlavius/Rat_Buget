import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Globe, DollarSign, ChevronDown, LogOut } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useState } from 'react';

export function Header() {
  const { language, setLanguage, currency, setCurrency, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, familyMembers } = useSupabaseAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RAT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              R.A.T Buget
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ro' | 'en')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ro">Română</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'RON' | 'EUR' | 'USD')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              title={theme === 'light' ? t('switchToDark') : t('switchToLight')}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* User Info and Sign Out */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
              {/* User Switch Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.user_metadata?.name || user.email || 'User')}`}
                    alt={user.user_metadata?.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.user_metadata?.nickname || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email} {user.user_metadata?.role === 'admin' && '• Admin'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.user_metadata?.name || user.email || 'User')}`}
                            alt={user.user_metadata?.name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.user_metadata?.nickname || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {familyMembers.filter(m => m.userId !== user?.id).map((member) => (
                          <button
                            key={member.id}
                            onClick={() => {
                              // Switch user functionality would go here
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          >
                            <img
                              src={member.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.nickname)}`}
                              alt={member.nickname}
                              className="w-6 h-6 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{member.nickname}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {member.profile?.email}
                              </p>
                            </div>
                          </button>
                        ))}

                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}