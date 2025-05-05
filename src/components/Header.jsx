import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../services/authService";

const Header = () => {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="header">
      <Link to="/home">Inicio</Link>
      <Link to="/converter">Conversor</Link>
      <Link to="/history">Histórico</Link>
      <Link to="/favorites">Favoritos</Link>
      <span><Link onClick={handleLogout}><i class="bi bi-box-arrow-right"></i> Sair</Link></span>
    </div>
  );
};

export default Header;
