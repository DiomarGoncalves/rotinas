import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';

interface RoutineProps {
  id: string;
  title: string;
  description: string;
  days: string[];
  time: string;
  priority: string;
  status: string;
}

const RoutineCard: React.FC<RoutineProps> = ({
  id,
  title,
  description,
  days,
  time,
  priority,
  status,
}) => {
  const priorityColors = {
    Alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Média: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Baixa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const statusColors = {
    pendente: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    concluída: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    atrasada: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDays = (days: string[]) => {
    if (!days || days.length === 0) return '';
    
    const dayMap: Record<string, string> = {
      Sunday: 'Dom',
      Monday: 'Seg',
      Tuesday: 'Ter',
      Wednesday: 'Qua',
      Thursday: 'Qui',
      Friday: 'Sex',
      Saturday: 'Sáb',
    };
    const shortDays = days.map(day => dayMap[day] || day.substring(0, 3));
    
    if (shortDays.length <= 3) {
      return shortDays.join(', ');
    } else {
      return `${shortDays.slice(0, 2).join(', ')} +${shortDays.length - 2}`;
    }
  };

  return (
    <Link 
      to={`/routines/${id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority as keyof typeof priorityColors]}`}>
            {priority}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={16} className="mr-1" />
            <span>{formatDays(days)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={16} className="mr-1" />
            <span>{formatTime(time)}</span>
          </div>
        </div>
      </div>
      
      <div className={`w-full py-2 text-center text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {{
          'pendente': 'Pendente',
          'concluída': 'Concluída',
          'atrasada': 'Atrasada'
        }[status] || status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </Link>
  );
};

export default RoutineCard;