import React, { useState } from 'react';
import { User, LogOut, Settings, Users, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const UserMenu: React.FC = () => {
  const { user, users, logout, switchUser } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  if (!user) return null;

  const otherUsers = users.filter(u => u.id !== user.id);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setShowUserSwitcher(false);
            }}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {otherUsers.length > 0 && (
                <button
                  onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>{t('auth.switchUser')}</span>
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showUserSwitcher ? 'rotate-180' : ''}`} />
                </button>
              )}

              {showUserSwitcher && (
                <div className="ml-4 py-2 border-l border-gray-200 dark:border-gray-700">
                  {otherUsers.map((otherUser) => (
                    <button
                      key={otherUser.id}
                      onClick={() => {
                        switchUser(otherUser.id);
                        setIsOpen(false);
                        setShowUserSwitcher(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <img
                        src={otherUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(otherUser.name)}`}
                        alt={otherUser.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{otherUser.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {otherUser.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('auth.signOut')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;