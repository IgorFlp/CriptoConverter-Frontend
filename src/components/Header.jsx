import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <Link to="/home">Home</Link>
      <Link to="/converter">Converter</Link>
      <Link to="/history">History</Link>
      <Link to="/favorites">Favorites</Link>
    </div>
  );
};

export default Header;
