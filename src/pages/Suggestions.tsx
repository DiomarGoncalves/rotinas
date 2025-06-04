import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { API_URL } from '../utils/constants';

interface Suggestion {
  id: string;
  profile: string;
  title: string;
  description: string;
  days: string[];
  time: string;
  priority: string;
}

const profileOptions = [
  { value: 'estudante', label: 'Estudante' },
  { value: 'trabalhador', label: 'Trabalhador' },
  { value: 'treinamento', label: 'Treinamento' },
];

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState('estudante');
  const [addingRoutines, setAddingRoutines] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/suggestions?profile=${selectedProfile}`);
        setSuggestions(res.data);
      } catch (err) {
        setError('Failed to fetch suggestions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [selectedProfile]);

  const handleAddRoutine = async (suggestion: Suggestion) => {
    try {
      setAddingRoutines(prev => ({ ...prev, [suggestion.id]: true }));
      
      const routineData = {
        title: suggestion.title,
        description: suggestion.description,
        days: suggestion.days,
        time: suggestion.time,
        priority: suggestion.priority,
      };
      
      await axios.post(`${API_URL}/routines`, routineData);
      
      // Show success message
      alert('Rotina adicionada com sucesso!');
    } catch (err) {
      setError('Failed to add routine');
    } finally {
      setAddingRoutines(prev => ({ ...prev, [suggestion.id]: false }));
    }
  };

  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return 'Nenhum dia selecionado';
    const diasPt: Record<string, string> = {
      'Monday': 'Segunda',
      'Tuesday': 'Terça',
      'Wednesday': 'Quarta',
      'Thursday': 'Quinta',
      'Friday': 'Sexta',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };
    return days.map(day => diasPt[day] || day).join(', ');
  };

  const formatTime = (time: string) => {
    if (!time) return 'Sem horário definido';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const priorityColors = {
    Alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Média: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Baixa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <Layout title="Sugestões de Rotinas">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Escolha um perfil para ver sugestões de rotinas adequadas para você:
        </p>
        
        <div className="flex flex-wrap gap-2">
          {profileOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedProfile(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedProfile === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{suggestion.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[suggestion.priority as keyof typeof priorityColors]}`}>
                    {suggestion.priority}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{suggestion.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <p><span className="font-medium">Dias:</span> {formatDays(suggestion.days)}</p>
                  <p><span className="font-medium">Horário:</span> {formatTime(suggestion.time)}</p>
                </div>
                
                <button
                  onClick={() => handleAddRoutine(suggestion)}
                  disabled={addingRoutines[suggestion.id]}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  {addingRoutines[suggestion.id] ? 'Adicionando...' : 'Adicionar à Minha Rotina'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Nenhuma sugestão disponível para este perfil</p>
        </div>
      )}
    </Layout>
  );
};

export default Suggestions;