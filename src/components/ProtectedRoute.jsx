import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Verifica se existe um userID salvo (ajuste conforme sua lógica de autenticação)
  const isAuthenticated = !!localStorage.getItem("userID");

  if (!isAuthenticated) {
    // Redireciona para a tela de login se não estiver autenticado
    return <Navigate to="/" replace />;
  }

  // Se autenticado, renderiza o componente filho normalmente
  return children;
};

export default ProtectedRoute;