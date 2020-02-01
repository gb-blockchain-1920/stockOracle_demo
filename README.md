# Stock Oracle
In class exercise, creating a oracle for stock prices.

Aaron Lu - 101278524

### Operating Instructions
1. Deploy the `stockPriceOracle.sol` file on a ganache server using [Remix IDE](https://remix.ethereum.org/) and `ganache-cli -d`
2. Get an API key from [Alpha Vantage](https://www.alphavantage.co/) and save it to a file in the `front-end` folder name `.env`. The contents should have
```
REACT_APP_STOCK_API_KEY=<your-api-key-here>
```
3. In the `front-end` folder, run the React build using `npm start`
4. `http://localhost:3000/` now has a basic distributed application that can act as a oracle!
