import React, { useEffect, useState, useCallback, useRef } from "react";
import Header from "../components/Header";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const REQUEST_COOLDOWN = 2000; // 2 seconds cooldown between requests

const Converter = () => {
  const [selectedOption, setSelectedOption] = useState("Selecione uma moeda");
  const [showDropdown, setShowDropdown] = useState(false);
  const [valor_reais, setValor_reais] = useState(0);
  const [valor_dolares, setValor_dolares] = useState(0);
  const [criptoInput, setCriptoInput] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastRequestTime = useRef(0);

  //const isFavorite = selectedOption && Array.isArray(userFavorites) && userFavorites.some(fav => fav.id === selectedOption.id);
  const isFavorite =
    selectedOption && userFavorites.some((fav) => fav.id === selectedOption.id);

  const handleSelect = (currency) => {
    setSelectedOption(currency);
    setShowDropdown(false);
  };

  const listCurrencies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(API_BASE_URL + "/currency");
      setCurrencies(response.data);
    } catch (err) {
      setError("Falha ao carregar moedas, tente novamente mais tarde.");
      console.error("Error fetching currencies:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    listCurrencies();
    setSelectedOption({
      id: "Selecione uma moeda",
      name: "Selecione uma moeda",
      image: "src/assets/react.svg",
    });
    const getFavorites = async () => {
      try {
        let res = await axios.get(API_BASE_URL + "/favoriteCoins", {
          withCredentials: true,
        });
        const storedFavorites = res.data;
        setUserFavorites(storedFavorites ? storedFavorites : []);
      } catch (err) {
        setError("Falha ao carregar favoritos, tente novamente mais tarde.");
        console.error("Error fetching favorites:", err);
      }
    };
    getFavorites();
  }, [listCurrencies]);

  const moneyConvertion = async (input) => {
    if (!selectedOption.id || selectedOption.id === "Selecione uma moeda") {
      setError("Por favor, selecione uma moeda");
      return;
    }

    const now = Date.now();
    if (now - lastRequestTime.current < REQUEST_COOLDOWN) {
      setError("Por favor, aguarde um momento antes de fazer outra conversão.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      lastRequestTime.current = now;

      let currencyUsd = await axios.get(API_BASE_URL + "/currency", {
        params: {
          id: selectedOption.id,
          currency: "usd",
        },
      });

      let currencyBrl = await axios.get(API_BASE_URL + "/currency", {
        params: {
          id: selectedOption.id,
          currency: "brl",
        },
      });

      let usdValue = (input * currencyUsd.data[0].current_price).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
        }
      );
      let brlValue = (input * currencyBrl.data[0].current_price).toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      );
      setValor_dolares(usdValue);
      setValor_reais(brlValue);

      const body = {
        newConversion: {
          coinID: selectedOption.id,
          coinName: selectedOption.name,
          coinImage: selectedOption.image,
          amount: input,
          brl: brlValue,
          usd: usdValue,
          timestamp: Date.now(),
        },
      };

      const request = await axios.post(
        API_BASE_URL + "/conversionHistory",
        body,
        { withCredentials: true }
      );
      if (request.status === 200) {
        console.log("Conversão inserida no historico");
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Muitas requisições. Por favor, aguarde um momento.");
      } else {
        setError("Falha ao converter moeda, tente novamente mais tarde.");
      }
      console.error("Error in conversion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const PutUserFavorites = async (newFavorites) => {
    try {
      const response = await axios.put(
        API_BASE_URL + "/favoriteCoins",
        {
          favoriteCoins: newFavorites,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        localStorage.setItem("userFavorites", JSON.stringify(newFavorites));
      }
    } catch (err) {
      setError("Falha ao atualizar favoritos, tente novamente mais tarde.");
      console.error("Error updating favorites:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="converter">
          {error && <div className="error-message">{error}</div>}
          <div className="row-1">
            <Dropdown
              show={showDropdown}
              onToggle={(nextShow) => setShowDropdown(nextShow)}
              className="custom-dropdown"
            >
              <Dropdown.Toggle id="dropdown-basic" className="dropdown-toggle">
                {selectedOption.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {currencies.map((currency) => (
                  <Dropdown.Item
                    className="dropdown-item"
                    key={currency.id}
                    as="button"
                    onClick={() => {
                      handleSelect(currency);
                    }}
                  >
                    <i
                      className="dropdown-coin-img"
                      src={currency.image}
                      alt=""
                    />
                    <label className="dropdown-coin-name">
                      {currency.name}
                    </label>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <i
              className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}
              onClick={() => {
                const newFavorites = isFavorite
                  ? userFavorites.filter((fav) => fav.id !== selectedOption.id)
                  : [
                      ...userFavorites,
                      {
                        id: selectedOption.id,
                        name: selectedOption.name,
                        image: selectedOption.image,
                      },
                    ];
                setUserFavorites(newFavorites);
                PutUserFavorites(newFavorites);
              }}
            ></i>
          </div>
          <div className="row-2">
            <input
              className="input-custom"
              type="number"
              placeholder="0"
              value={criptoInput}
              onChange={(e) => {
                setCriptoInput(e.target.value);
              }}
            />
            <button
              onClick={() => {
                moneyConvertion(criptoInput);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Convertendo" : "Converter"}
            </button>
          </div>
          <div className="row-3">
            <div className="row-3-item">
              <p>Valor em Reais</p>
              <p id="valor-em-reais">{valor_reais}</p>
            </div>
            <div className="row-3-item">
              <p>Valor em Dolares</p>
              <p id="valor-em-dolares">{valor_dolares}</p>
            </div>
          </div>

          <a className="coingecko-link" href="https://www.coingecko.com/">
            <label>Price data by </label>
            <img src="src\assets\CGAPI-Lockup-1.svg" alt="CoinGecko"></img>
          </a>
        </div>
      </div>
    </>
  );
};

export default Converter;
