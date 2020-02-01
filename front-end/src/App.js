import React from "react";
// import logo from "./logo.svg";
import Web3 from "web3";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quotecontract";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const web3 = new Web3("http://localhost:8545");
const stockQuote = new web3.eth.Contract(
  STOCK_ORACLE_ABI,
  STOCK_ORACLE_ADDRESS
);

function App() {
  const [stock, setStock] = React.useState("");
  const [data, setData] = React.useState({});
  const [accounts, setAccounts] = React.useState([]);
  const [price, setPrice] = React.useState(null);
  const [volume, setVolume] = React.useState(null);

  React.useEffect(() => {
    const getAccounts = async () => {
      const accountsTemp = await web3.eth.getAccounts();
      setAccounts(accountsTemp);
    };
    getAccounts();
  }, []);

  React.useEffect(() => {
    const writeToContract = async () => {
      console.log(
        web3.utils.fromAscii(stock),
        Number(data["05. price"]) * 100,
        Number(data["06. volume"])
      );
      await stockQuote.methods
        .setStock(
          web3.utils.fromAscii(stock),
          Math.round(Number(data["05. price"]) * 100),
          Number(data["06. volume"])
        )
        .send({ from: accounts[0] });
      setData({});
    };

    const readFromContract = async () => {
      var retPrice = await stockQuote.methods
        .getStockPrice(web3.utils.fromAscii(stock))
        .call();
      var retVolume = await stockQuote.methods
        .getStockVolume(web3.utils.fromAscii(stock))
        .call();

      setVolume(Number(retVolume));
      setPrice(retPrice/100);
      // console.log(retPrice, retVolume);
    };

    if (Object.keys(data).length !== 0 && stock.length !== 0) {
      writeToContract();
      setTimeout(readFromContract, 500); //let ganache commit transaction
    }
  }, [data, stock, accounts]);

  const getAPIdata = async () => {
    if (stock.length !== 0) {
      // console.log(stock);
      // console.log(process.env.REACT_APP_STOCK_API_KEY);
      await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${process.env.REACT_APP_STOCK_API_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          if (data["Global Quote"]) {
            setData(data["Global Quote"]);
          }
        })
        .catch(console.log);
    }
  };

  const printData = (
    <div className="output-data">
      <p>
        {`Price: ${price}`}
      </p>
      <p> {`Volume: ${volume}`}</p>
    </div>
  )

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
      {price !== null && volume !== null && printData}
    </div>
  );
}

export default App;
