import React, { useEffect } from "react";
import Header from "../components/Header";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";
const userID = localStorage.getItem("userID");

const Converter = () => {
  const [selectedOption, setSelectedOption] = useState("Selecione uma moeda");
  const [showDropdown, setShowDropdown] = useState(false);
  const [valor_reais, setValor_reais] = useState(0);
  const [valor_dolares, setValor_dolares] = useState(0);
  const [criptoInput, setCriptoInput] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  const isFavorite =
    selectedOption && userFavorites.includes(selectedOption.id);

  const handleSelect = (currency) => {
    setSelectedOption(currency);
    setShowDropdown(false);
  };
  const moneyConvertion = async (input) => {
    //fazer um fetch pra pegar o valor da moeda por id atualizado sempre que apertar o botão, crypto flutua muito rapido

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
      userID: userID,
      newConversion: {
        coinID: selectedOption.id,
        amount: input,
        brl: brlValue,
        usd: usdValue,
        timestamp: Date.now(),
      },
    };
    const request = await axios.post(API_BASE_URL + "/conversionHistory", body);
    if (request.status === 200) {
      console.log("Conversão inserida no historico");
    } else {
      console.log(
        "Erro na inserção no historico: " + request.status + " " + request.data
      );
    }
    //salvar no historico do usuario
  };
  const PutUserFavorites = async (newFavorites) => {
    try {
      const response = await axios.put(API_BASE_URL + "/favoriteCoins", {
        userID: userID,
        favoriteCoins: newFavorites,
      });
      if (response.status === 200) {
        localStorage.setItem("userFavorites", newFavorites);
      } else {
        console.log("Resposta inesperada", response.status + response.data);
      }
    } catch (error) {
      if (error.response) {
        console.log(
          "Erro na resposta da api" +
            error.response.status +
            error.response.data
        );
      } else if (error.request) {
        console.log(
          "Erro na requisição da api" +
            error.request.status +
            error.request.data
        );
      } else {
        console.error("Erro desconhecido:", error.message);
      }
    }
  };
  useEffect(() => {
    const listCurrencies = () => {
      const result = axios.get(API_BASE_URL + "/currency").then((response) => {
        setCurrencies(response.data);
      });
    };
    listCurrencies();
    setSelectedOption({
      id: "Selecione uma moeda",
      name: "Selecione uma moeda",
      image: "src/assets/react.svg",
    });
    setUserFavorites(localStorage.getItem("userFavorites").split(","));
  }, []);
  return (
    <>
      <Header />
      <div className="main-content">
        <div className="converter">
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
                  ? userFavorites.filter((id) => id !== selectedOption.id)
                  : [...userFavorites, selectedOption.id];
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
            >
              Converter
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

            <img src="src\assets\CGAPI-Lockup-1.svg"></img>
          </a>
        </div>
      </div>
    </>
  );
};

export default Converter;
