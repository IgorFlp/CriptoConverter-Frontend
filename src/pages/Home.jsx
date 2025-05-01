import React from "react";
import Header from "../components/Header";

const Home = () => {
  const userId = localStorage.getItem("userID");
  const userName = localStorage.getItem("userName");
  console.log(userId, userName);
  return (
    <>
      <div className="main-content">
        <div className="home">
          Olá {userName} por favor use a barra de navegação do header para
          acessar as paginas do site
        </div>
      </div>
    </>
  );
};

export default Home;
