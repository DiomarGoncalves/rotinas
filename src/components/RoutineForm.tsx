import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constants';

interface RoutineFormProps {
  routine?: {
    id: string;
    title: string;
    description: string;
    days: string[];
    time: string;
    priority: string;
    status: string;
  };
  onSubmit: (data: FormData) => Promise<void>;
  isEditing?: boolean;
}

interface FormData {
  title: string;
  description: string;
  days: string[];
  time: string;
  priority: string;
  status?: string;
}

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const weekdaysPt = [
  { en: 'Monday', pt: 'Segunda' },
  { en: 'Tuesday', pt: 'Terça' },
  { en: 'Wednesday', pt: 'Quarta' },
  { en: 'Thursday', pt: 'Quinta' },
  { en: 'Friday', pt: 'Sexta' },
  { en: 'Saturday', pt: 'Sábado' },
  { en: 'Sunday', pt: 'Domingo' },
];

const priorities = ['Alta', 'Média', 'Baixa'];
const statuses = ['pendente', 'concluída', 'atrasada'];

const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    title: routine?.title || '',
    description: routine?.description || '',
    days: routine?.days || [],
    time: routine?.time?.slice(0, 5) || '',
    priority: routine?.priority || 'Média',
    status: routine?.status || 'pendente',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: newDays };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
      navigate('/routines');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save routine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative\" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Título
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dias da Semana
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {weekdaysPt.map(day => (
            <div key={day.en} className="flex items-center">
              <input
                type="checkbox"
                id={`day-${day.en}`}
                checked={formData.days.includes(day.en)}
                onChange={() => handleDayToggle(day.en)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`day-${day.en}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {day.pt}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Horário
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Prioridade
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {priorities.map(priority => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
      
      {isEditing && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/routines')}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default RoutineForm;