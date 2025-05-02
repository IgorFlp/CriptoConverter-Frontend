import React from "react";
import { useState } from "react";
import axios from "axios";

const API_BASEURL = "http://localhost:5000/";
const StartLogin = (user, password) => {
  if (!user || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  axios
    .post(API_BASEURL + "login", { user, password })
    .then((response) => {
      if (response.status === 200) {
        //SUBSTITUIR POR SOLUÇÃO MAIS ROBUSTA
        localStorage.setItem("userID", response.data.userId);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("userFavorites", response.data.userFavorites);
        window.location.href = "/home";
      } else {
        alert("Erro ao realizar login!");
      }
    })
    .catch((error) => {
      if (error.response) {
        alert("Erro ao realizar login!");
      } else if (error.request) {
        alert("Erro ao realizar login!");
      } else {
        alert("Erro ao realizar login!");
      }
    });
};
const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-container">
      <label>Preencha as informações de login</label>
      <div>
        <div className="login-inputs-row">
          <label>Usuario</label>
          <input
            className="user-input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Preencha o nome de usuario"
          ></input>
        </div>
        <div className="login-inputs-row">
          <label>Senha</label>
          <input
            className="pwd-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Preencha a senha"
          ></input>
        </div>
      </div>
      <button
        className="login-button"
        onClick={() => {
          StartLogin(user, password);
        }}
      >
        Entrar
      </button>
    </div>
  );
};

export default Login;
