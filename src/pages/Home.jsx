import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios.get(VITE_API_URL + "/me", { withCredentials: true }).then((res) => {
      setUser(res.data.userName);
      console.log(res.data);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="home">
          Olá {user} por favor use a barra de navegação do header para acessar
          as paginas do site
        </div>
      </div>
    </>
  );
};

export default Home;
