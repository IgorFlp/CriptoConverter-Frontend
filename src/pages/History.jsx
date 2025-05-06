import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Table from "react-bootstrap/Table";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const pad = (n) => n.toString().padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Mês começa do zero
    const year = date.getFullYear();

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    let formated = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`; // Mês começa do zero
    return formated;
  };
  let headers = [
    { name: "ID da moeda", tag: "coinID" },
    { name: "Nome da moeda", tag: "coinName" }, //currency list
    { name: "Quant.", tag: "amount" },
    { name: "R$", tag: "brl" },
    { name: "USD", tag: "usd" },
    { name: "Horario", tag: "timestamp" },
  ];
  useEffect(() => {
    axios.get(API_BASE_URL + "/me", { withCredentials: true }).then((res) => {
      console.log(res.data);
    });
    const fetchConversionHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(API_BASE_URL + "/conversionHistory", {
          withCredentials: true,
        });
        if (res) {
          setHistoryData(res.data);
        }
      } catch (err) {
        setError(
          "Erro ao carregar historico de conversões, tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversionHistory();
  }, []);
  return (
    <>
      <Header />
      <div className="main-content">
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="loading-message">
            Carregando historico de conversões...
          </div>
        ) : (
          <div className="history-card-container">
            {historyData.length === 0 ? (
              <div className="no-favorites-message">
                Você ainda não fez nenhuma conversão, faça uma no conversor!
              </div>
            ) : (
              historyData.map((history) => (
                <div key={history.coindId} className="history-card">
                  <div className="coin-logo">
                    <img
                      src={history.coinImage}
                      alt={`${history.coinName} logo`}
                    />
                  </div>
                  <div className="coin-info">
                    <h3>{history.coinName}</h3>
                    <p>Quantidade: {history.amount}</p>
                    <p>Valor em BRL: {history.brl}</p>
                    <p>Valor em USD: {history.usd}</p>
                    <p>Horario: {formatDate(history.timestamp)}</p>
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

export default History;
