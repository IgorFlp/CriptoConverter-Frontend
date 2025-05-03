import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Table from "react-bootstrap/Table";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";
const userID = localStorage.getItem("userID");

const History = () => {
  const [historyTableData, setHistoryTableData] = useState([]);

  let headers = [
    { name: "ID da moeda", tag: "coinID" },
    { name: "Nome da moeda", tag: "name" }, //currency list
    { name: "Quant.", tag: "amount" },
    { name: "R$", tag: "brl" },
    { name: "USD", tag: "usd" },
    { name: "Horario", tag: "timestamp" },
  ];
  useEffect(() => {
    const fetchConversionHistory = async () => {
      const res = await axios.get(API_BASE_URL + "/historyTable", {
        params: { userID: userID },
      });
      if (res) {
        //console.log("history: " + JSON.stringify(res.data));

        setHistoryTableData(res.data);
      }
    };
    fetchConversionHistory();
  }, []);
  return (
    <>
      <Header />
      <div className="main-content">
        <div className="history">
          <Table striped bordered hover variant="dark" className="">
            <thead className="thead-dark">
              <tr>
                {headers.map((h) => {
                  return (
                    <th key={h.tag} scope="col">
                      {h.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {historyTableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((h) => (
                    <td key={h.tag} scope="row">
                      {row[h.tag]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default History;
