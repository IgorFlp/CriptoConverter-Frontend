import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { user, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Verifica se o token está nos cookies
        console.log("Response:", response);
        console.log("Cookies:", document.cookie);

        // Redireciona para a página inicial
        navigate("/home");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h3 className="login-title">Bem-vindo ao CriptoConverter</h3>
        <div className="login-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="login-inputs-row">
              <label className="input-label">Usuario</label>
              <input
                className="user-input"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Digite seu usuario"
                required
              />
            </div>
            <div className="login-inputs-row">
              <label className="input-label">Senha</label>
              <input
                className="pwd-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <div className="login-buttons">
              <button className="login-button" type="submit">
                Entrar
              </button>
              <button
                className="login-button create-account-button"
                onClick={() => navigate("/register")}
              >
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
