import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const logout = async () => {
  try {
    // Chama o endpoint de logout no backend
    await axios.post(
      `${VITE_API_URL}/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Redireciona para a página inicial
    window.location.href = "/";
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};

// Função para verificar se o usuário está autenticado
export const checkAuth = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/me`, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
