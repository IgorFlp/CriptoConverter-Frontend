import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(VITE_API_URL + "/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // ou algum componente de loading
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
