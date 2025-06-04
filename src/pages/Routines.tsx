import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import RoutineCard from '../components/RoutineCard';
import { API_URL } from '../utils/constants';

interface Routine {
  id: string;
  title: string;
  description: string;
  days: string[];
  time: string;
  priority: string;
  status: string;
}

const priorities = ['Todas', 'Alta', 'Média', 'Baixa'];
const statuses = ['Todas', 'pendente', 'concluída', 'atrasada'];

const Routines: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await axios.get(`${API_URL}/routines`);
        setRoutines(res.data);
        setFilteredRoutines(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch routines');
        setLoading(false);
      }
    };
    
    fetchRoutines();
  }, []);

  useEffect(() => {
    let result = routines;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(routine => 
        routine.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        routine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'Todas') {
      result = result.filter(routine => routine.priority === priorityFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'Todas') {
      result = result.filter(routine => routine.status === statusFilter);
    }
    
    setFilteredRoutines(result);
  }, [searchTerm, priorityFilter, statusFilter, routines]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout title="Minhas Rotinas">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar rotinas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={toggleFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </button>
          
          <Link
            to="/routines/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Rotina
          </Link>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridade
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'Todas' ? status : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : filteredRoutines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map(routine => (
            <RoutineCard key={routine.id} {...routine} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {routines.length > 0
              ? 'Nenhuma rotina encontrada com os filtros aplicados'
              : 'Você ainda não tem rotinas cadastradas'}
          </p>
          <Link
            to="/routines/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Criar Rotina
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Routines;