import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import RoutineForm from '../components/RoutineForm';
import { API_URL } from '../utils/constants';

interface Routine {
  id: string;
  title: string;
  description: string;
  days: string[];
  time: string;
  priority: string;
  status: string;
  created_at: string;
}

const RoutineDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await axios.get(`${API_URL}/routines/${id}`);
        setRoutine(res.data);
        setLoading(false);
      } catch (err) {
        setError('Falha ao buscar detalhes da rotina');
        setLoading(false);
      }
    };
    
    fetchRoutine();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!routine) return;
    
    try {
      const updatedRoutine = { ...routine, status: newStatus };
      const res = await axios.put(`${API_URL}/routines/${id}`, updatedRoutine);
      setRoutine(res.data);
    } catch (err) {
      setError('Falha ao atualizar status da rotina');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/routines/${id}`);
      navigate('/routines');
    } catch (err) {
      setError('Falha ao excluir rotina');
    }
  };

  const handleEditSubmit = async (data: any) => {
    try {
      const res = await axios.put(`${API_URL}/routines/${id}`, data);
      setRoutine(res.data);
      setEditing(false);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Falha ao salvar rotina');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
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

  const statusColors = {
    pendente: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    concluída: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    atrasada: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <Layout title="Detalhes da Rotina">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </Layout>
    );
  }

  if (!routine) {
    return (
      <Layout title="Detalhes da Rotina">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Rotina não encontrada</p>
          <Link
            to="/routines"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar para Rotinas
          </Link>
        </div>
      </Layout>
    );
  }

  if (editing) {
    return (
      <Layout title="Editar Rotina">
        <RoutineForm
          routine={routine}
          onSubmit={handleEditSubmit}
          isEditing={true}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes da Rotina">
      <div className="mb-6">
        <Link
          to="/routines"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para rotinas
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">{routine.title}</h2>
            
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[routine.priority as keyof typeof priorityColors]}`}>
                {routine.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[routine.status as keyof typeof statusColors]}`}>
                {{
                  'pendente': 'Pendente',
                  'concluída': 'Concluída',
                  'atrasada': 'Atrasada'
                }[routine.status] || routine.status.charAt(0).toUpperCase() + routine.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="text-gray-600 dark:text-gray-300 mb-6">
            <p className="mb-4">{routine.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dias da Semana</h4>
                <div className="flex flex-wrap gap-1">
                  {routine.days && routine.days.map(day => {
                    const diasPt: Record<string, string> = {
                      'Monday': 'Segunda',
                      'Tuesday': 'Terça',
                      'Wednesday': 'Quarta',
                      'Thursday': 'Quinta',
                      'Friday': 'Sexta',
                      'Saturday': 'Sábado',
                      'Sunday': 'Domingo'
                    };
                    return (
                      <span key={day} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {diasPt[day] || day}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</h4>
                <p>{formatTime(routine.time)}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Criado em: {formatDate(routine.created_at)}
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-2">
            {routine.status !== 'concluída' && (
              <button
                onClick={() => handleStatusChange('concluída')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Marcar como Concluída
              </button>
            )}
            
            {routine.status === 'concluída' && (
              <button
                onClick={() => handleStatusChange('pendente')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Clock className="mr-2 h-5 w-5" />
                Marcar como Pendente
              </button>
            )}
            
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <Edit className="mr-2 h-5 w-5" />
              Editar
            </button>
            
            <button
              onClick={() => setDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Excluir
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmação de exclusão */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Excluir Rotina
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tem certeza que deseja excluir esta rotina? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setDeleteModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RoutineDetails;