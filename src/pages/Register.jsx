import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const PostRegister = (user, password) => {
  if (!user || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  axios
    .post(VITE_API_URL + "register", { user, password })
    .then((response) => {
      if (response.status === 200) {
        alert("Conta criada com sucesso!");
        window.location.href = "/";
      } else {
        alert("Erro ao criar conta!");
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        alert("Esse nome de usuário já está em uso. Por favor, escolha outro.");
      } else {
        alert("Erro ao registrar. Tente novamente.");
        console.error(error);
      }
    });
};
const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      PostRegister(user, password);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h3 className="login-title">Crie sua conta</h3>
        <div className="login-form">
          <div className="login-inputs-row">
            <label className="input-label">Usuário</label>
            <input
              className="user-input"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Digite seu usuário"
            />
          </div>
          <div className="login-inputs-row">
            <label className="input-label">Senha</label>
            <input
              className="pwd-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua senha"
            />
          </div>
          <div className="login-buttons">
            <button
              className="login-button"
              onClick={() => PostRegister(user, password)}
            >
              Criar Conta
            </button>
            <button
              className="create-account-button"
              onClick={() => navigate("/")}
            >
              Voltar para Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
