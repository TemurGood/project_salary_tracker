// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService.js';

/**
 * Компонент для защиты приватных маршрутов
 * Если пользователь не авторизован — перенаправляет на /login
 * Если авторизован — показывает дочерние маршруты (Outlet)
 */
function ProtectedRoute() {
  const isAuth = isAuthenticated();
  
  // Если не авторизован — редирект на страницу входа
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Если авторизован — показываем дочерние маршруты
  return <Outlet />;
}

export default ProtectedRoute;