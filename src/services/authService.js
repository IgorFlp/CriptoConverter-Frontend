import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const logout = async () => {
  try {   
    // Chama o endpoint de logout no backend
    await axios.post(`${API_BASE_URL}/logout`, {}, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Redireciona para a página inicial
    window.location.href = "/";
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

// Função para verificar se o usuário está autenticado
export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}; 