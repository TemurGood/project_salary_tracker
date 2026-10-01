// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import History from './pages/History/History.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout/Layout.jsx'; // Если у тебя есть Layout
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты (доступны всем) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Приватные маршруты (требуют авторизации) */}
        <Route element={<ProtectedRoute />}>
          {/* Если у тебя есть Layout — оберни в него */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          
          {/* Если Layout нет — оставь так:
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          */}
        </Route>
        
        {/* Редирект с любых других путей на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;