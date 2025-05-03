import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";


const Favorites = () => {
  const [favoriteCoins, setFavoriteCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteCoins = async () => {
      try {
        setIsLoading(true);
        setError(null);       
        
        const response = await axios.get(`${API_BASE_URL}/favoriteCoins`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          setFavoriteCoins(response.data);
        }
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
        if (err.response) {
          // O servidor respondeu com um status de erro
          setError(`Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Erro desconhecido'}`);
        } else if (err.request) {
          // A requisição foi feita mas não houve resposta
          setError("Não foi possível conectar ao servidor. Verifique se o servidor está rodando.");
        } else {
          // Algo aconteceu na configuração da requisição
          setError("Erro ao configurar a requisição. Tente novamente mais tarde.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCoins();
  }, []);

  return (
    <>
      <Header />
      <div className="main-content">
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="loading-message">Carregando moedas favoritas...</div>
        ) : (
          <div className="favorite-coins-container">
            {favoriteCoins.length === 0 ? (
              <div className="no-favorites-message">
                Você ainda não tem moedas favoritas. Adicione algumas no conversor!
              </div>
            ) : (
              favoriteCoins.map((coin) => (
                <div key={coin.id} className="favorite-coin-card">
                  <div className="coin-logo">
                    <img src={coin.image} alt={`${coin.name} logo`} />
                  </div>
                  <div className="coin-info">
                    <h3>{coin.name}</h3>
                    <p>{coin.symbol}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
