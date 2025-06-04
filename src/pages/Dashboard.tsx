import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';
import RoutineCard from '../components/RoutineCard';
import { API_URL } from '../utils/constants';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Routine {
  id: string;
  title: string;
  description: string;
  days: string[];
  time: string;
  priority: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    late: 0,
  });

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await axios.get(`${API_URL}/routines`);
        setRoutines(res.data);
        
        // Calculate stats
        const total = res.data.length;
        const completed = res.data.filter((r: Routine) => r.status === 'concluída').length;
        const pending = res.data.filter((r: Routine) => r.status === 'pendente').length;
        const late = res.data.filter((r: Routine) => r.status === 'atrasada').length;
        
        setStats({
          total,
          completed,
          pending,
          late,
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch routines');
        setLoading(false);
      }
    };
    
    fetchRoutines();
  }, []);

  // Chart data
  const doughnutData = {
    labels: ['Concluídas', 'Pendentes', 'Atrasadas'],
    datasets: [
      {
        data: [stats.completed, stats.pending, stats.late],
        backgroundColor: ['#10B981', '#3B82F6', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  // Get days of the week and count routines for each day
  const dayRoutineCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  routines.forEach(routine => {
    if (routine.days) {
      routine.days.forEach(day => {
        const dayIndex = days.indexOf(day);
        if (dayIndex !== -1) {
          dayRoutineCounts[dayIndex]++;
        }
      });
    }
  });

  const barData = {
    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    datasets: [
      {
        label: 'Rotinas',
        data: dayRoutineCounts,
        backgroundColor: '#8B5CF6',
      },
    ],
  };

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Rotinas</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.total}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Concluídas</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.completed}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.pending}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Atrasadas</p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.late}</p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Status das Rotinas</h3>
              <div className="h-64 flex items-center justify-center">
                {stats.total > 0 ? (
                  <Doughnut 
                    data={doughnutData} 
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: 'rgb(107, 114, 128)',
                          }
                        }
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma rotina cadastrada</p>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Rotinas por Dia</h3>
              <div className="h-64">
                {stats.total > 0 ? (
                  <Bar 
                    data={barData} 
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0,
                          }
                        }
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma rotina cadastrada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Recent routines */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Rotinas Recentes</h3>
              <Link 
                to="/routines"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium"
              >
                Ver todas
              </Link>
            </div>
            
            {routines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routines.slice(0, 3).map(routine => (
                  <RoutineCard key={routine.id} {...routine} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Você ainda não tem rotinas cadastradas</p>
                <Link
                  to="/routines"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Criar Rotina
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;