import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ListTodo, 
  Lightbulb, 
  User, 
  LogOut, 
  Menu, 
  X,
  Calendar,
  CalendarRange
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/dashboard', name: 'Painel', icon: <LayoutDashboard size={20} /> },
    { path: '/routines', name: 'Minhas Rotinas', icon: <ListTodo size={20} /> },
    { path: '/weekly-plan', name: 'Plano Semanal', icon: <CalendarRange size={20} /> },
    { path: '/suggestions', name: 'Sugestões', icon: <Lightbulb size={20} /> },
    { path: '/profile', name: 'Perfil', icon: <User size={20} /> },
  ];

  const sidebarClasses = `fixed md:relative bg-blue-600 dark:bg-gray-800 text-white h-full w-64 transition-all duration-300 ease-in-out transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  } z-20`;

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-blue-600 text-white"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className={sidebarClasses}>
        <div className="p-6 flex items-center space-x-2">
          <Calendar size={28} className="text-white" />
          <h1 className="text-xl font-bold">Minha Rotina</h1>
        </div>
        
        <div className="px-6 py-2 border-t border-blue-700 dark:border-gray-700">
          <p className="text-sm text-blue-200 dark:text-gray-400">Olá, {user?.name}</p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-white hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-blue-700 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            
            <li>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-6 py-3 text-white hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="mr-3"><LogOut size={20} /></span>
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;