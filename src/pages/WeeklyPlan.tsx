import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Edit2 } from 'lucide-react';
import Layout from '../components/Layout';
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

const WeeklyPlan: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const weekDaysPt: Record<string, string> = {
    'Monday': 'Segunda',
    'Tuesday': 'Terça',
    'Wednesday': 'Quarta',
    'Thursday': 'Quinta',
    'Friday': 'Sexta',
    'Saturday': 'Sábado',
    'Sunday': 'Domingo'
  };

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await axios.get(`${API_URL}/routines`);
        setRoutines(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch routines');
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  const getRoutinesForDay = (day: string) => {
    return routines.filter(routine => routine.days.includes(day))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const priorityColors = {
    Alta: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    Média: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    Baixa: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  };

  if (loading) {
    return (
      <Layout title="Plano Semanal">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Plano Semanal">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Plano Semanal">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
        {weekDays.map(day => (
          <div key={day} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-800 px-4 py-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {weekDaysPt[day] || day}
              </h3>
            </div>
            
            <div className="p-4">
              {getRoutinesForDay(day).length > 0 ? (
                <div className="space-y-3">
                  {getRoutinesForDay(day).map(routine => (
                    <div
                      key={routine.id}
                      className={`border-l-4 rounded p-3 ${priorityColors[routine.priority as keyof typeof priorityColors]}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{routine.title}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(routine.time)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{routine.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p>Nenhuma rotina para este dia</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default WeeklyPlan;