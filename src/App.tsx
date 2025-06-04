import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Routines from './pages/Routines';
import RoutineDetails from './pages/RoutineDetails';
import WeeklyPlan from './pages/WeeklyPlan';
import Suggestions from './pages/Suggestions';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/routines" element={
              <PrivateRoute>
                <Routines />
              </PrivateRoute>
            } />
            <Route path="/routines/new" element={
              <PrivateRoute>
                <RoutineDetails />
              </PrivateRoute>
            } />
            <Route path="/routines/:id" element={
              <PrivateRoute>
                <RoutineDetails />
              </PrivateRoute>
            } />
            <Route path="/weekly-plan" element={
              <PrivateRoute>
                <WeeklyPlan />
              </PrivateRoute>
            } />
            <Route path="/suggestions" element={
              <PrivateRoute>
                <Suggestions />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard\" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;