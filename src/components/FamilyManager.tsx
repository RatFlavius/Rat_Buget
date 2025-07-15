import React, { useState } from 'react';
import { Plus, Users, Crown, User, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useLanguage } from '../contexts/LanguageContext';

const FamilyManager: React.FC = () => {
  const { user, familyMembers, createFamilyMember, loadFamilyMembers } = useSupabaseAuth();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nickname: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.nickname) {
      setError('Toate câmpurile sunt obligatorii');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await createFamilyMember(
        formData.name,
        formData.email,
        formData.password,
        formData.nickname
      );

      if (success) {
        setFormData({ name: '', email: '', password: '', nickname: '' });
        setShowForm(false);
        await loadFamilyMembers();
      } else {
        setError('Eroare la crearea contului. Verifică dacă email-ul nu este deja folosit.');
      }
    } catch (err) {
      setError('A apărut o eroare neașteptată');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gestionare Familie
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adaugă Membru Familie</span>
          </button>
        )}
      </div>

      {/* Add Family Member Form */}
      {showForm && isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Adaugă Membru Familie Nou
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nume Complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Maria Popescu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Maria, Copil1, etc."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="maria@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parolă
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Minim 6 caractere"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError('');
                  setFormData({ name: '', email: '', password: '', nickname: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Creează Cont</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Family Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Membrii Familiei</span>
        </h3>

        <div className="space-y-3">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  member.role === 'admin' 
                    ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                    : 'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  {member.role === 'admin' ? (
                    <Crown className={`w-5 h-5 ${
                      member.role === 'admin' 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  ) : (
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {member.nickname}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.profile?.name} • {member.profile?.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {member.role === 'admin' ? 'Administrator' : 'Utilizator'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {member.userId === user?.id && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                    Tu
                  </span>
                )}
                {isAdmin && member.userId !== user?.id && member.role !== 'admin' && (
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Șterge membru"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {familyMembers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nu sunt membri în familie încă
            </p>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Doar administratorii pot adăuga membri noi în familie.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyManager;