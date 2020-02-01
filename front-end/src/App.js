import React from "react";
// import logo from "./logo.svg";
import Web3 from "web3";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quotecontract";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const web3 = new Web3("http://localhost:8545");
let accounts;
const stockQuote = new web3.eth.Contract(
  STOCK_ORACLE_ABI,
  STOCK_ORACLE_ADDRESS
);

function App() {
  const [stock, setStock] = React.useState("");
  const [data, setData] = React.useState({});
  const [accounts, setAccounts] = React.useState([]);

  React.useEffect(() => {
    const getAccounts = async () => {
      const accountsTemp = await web3.eth.getAccounts();
      setAccounts(accountsTemp)
      // console.log("Account 0 = ", accounts[0]);
      // var retval = await stockQuote.methods
      //   .getStockPrice(web3.utils.fromAscii("AAAA"))
      //   .call();
      // console.log(retval);
    };
    getAccounts();
  }, [])

  React.useEffect(() => {
    const writeToContract = async () => {
      console.log(
        web3.utils.fromAscii(stock),
        Number(data["05. price"]) * 100,
        Number(data["06. volume"])
      );
      const output = await stockQuote.methods
        .setStock(
          web3.utils.fromAscii(stock),
          Number(data["05. price"]) * 100,
          Number(data["06. volume"])
        )
        .send({from: accounts[0]});
      setStock("");
      setData({});
    };
    // testFunc();

    if (Object.keys(data).length !== 0 && stock.length !== 0) {
      writeToContract();
    }
  }, [data, stock]);

  const getAPIdata = async () => {
    if (stock.length !== 0) {
      // console.log(stock);
      // console.log(process.env.REACT_APP_STOCK_API_KEY);
      const res = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${process.env.REACT_APP_STOCK_API_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          setData(data["Global Quote"]);
          // console.log(data["Global Quote"]);
        })
        .catch(console.log);
    }
  };

  return (
    <div className="App">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Stock Oracle</Form.Label>
          <Form.Control
            type="symbol"
            placeholder="Stock Symbol"
            value={stock}
            onChange={event => {
              setStock(event.target.value.slice(0, 4).toUpperCase());
            }}
          />
          <Form.Text className="text-muted">
            Please input a stock symbol.
          </Form.Text>
        </Form.Group>
      </Form>
      <Button onClick={getAPIdata}>Submit</Button>
    </div>
  );
}

export default App;
