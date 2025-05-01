import React from "react";
import Header from "../components/Header";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useState } from "react";

const Converter = () => {
  const [selectedOption, setSelectedOption] = useState("Selecione uma moeda");
  const [showDropdown, setShowDropdown] = useState(false);
  const [valor_reais, setValor_reais] = useState(0);
  const [valor_dolares, setValor_dolares] = useState(0);
  const [criptoInput, setCriptoInput] = useState(0);

  const handleSelect = (value) => {
    setSelectedOption(value);
    setShowDropdown(false);
  };
  const moneyConvertion = (input) => {
    let valorEmReais = Math.floor(input * 5000).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    let valorEmDolares = Math.floor(input * 1000).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    setValor_reais(valorEmReais);
    setValor_dolares(valorEmDolares);
    //salvar no historico do usuario
  };
  const favoriteCoin = (coin, status) => {
    console.log(coin + "" + status);
    //PUT /api/favorites
  };

  let moedas = ["BTC", "ETH", "Doge"];
  return (
    <>
      <div className="main-content">
        <div className="converter">
          <div className="row-1">
            <Dropdown
              show={showDropdown}
              onToggle={(nextShow) => setShowDropdown(nextShow)}
              className="custom-dropdown"
            >
              <Dropdown.Toggle id="dropdown-basic" className="dropdown-toggle">
                {selectedOption}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {moedas.map((moeda) => (
                  <Dropdown.Item
                    className="dropdown-item"
                    key={moeda}
                    as="button"
                    onClick={() => {
                      handleSelect(moeda);
                    }}
                  >
                    {moeda}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <i
              className="bi bi-heart"
              onClick={(e) => {
                favoriteCoin(
                  selectedOption,
                  !e.target.classList.contains("bi-heart-fill")
                );
                e.target.classList.toggle("bi-heart-fill");
                e.target.classList.toggle("bi-heart");
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
          <div className="row-4">
            <a href="https://www.coingecko.com/">
              Price data by <img src="src\assets\CGAPI-Lockup-1.svg"></img>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Converter;
