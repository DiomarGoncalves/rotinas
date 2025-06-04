import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout title="Perfil">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <User size={48} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <Mail className="text-gray-500 dark:text-gray-400 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">E-mail</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <Calendar className="text-gray-500 dark:text-gray-400 mr-3" size={20} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Membro desde</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(user?.created_at)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              {!isConfirmingLogout ? (
                <button
                  onClick={() => setIsConfirmingLogout(true)}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sair da Conta
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Tem certeza que deseja sair?</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsConfirmingLogout(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={logout}
                      className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sim, sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;