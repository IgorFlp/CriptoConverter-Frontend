import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Home = () => {
  const [user, setUser] = useState(null);
  useEffect(()=>{
    axios.get(API_BASE_URL + "/me", { withCredentials: true })
  .then(res => {     
    setUser(res.data.userName);
    console.log(res.data);
  });
  }, []);  

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="home">
          Olá {user} por favor use a barra de navegação do header para
          acessar as paginas do site
        </div>
      </div>
    </>
  );
};

export default Home;
