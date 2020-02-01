pragma solidity ^0.5.16;


contract stockPriceOracle {
    
    /// quote structure
    struct stock {
        uint price;
        uint volume;
    }
    mapping (bytes4 => stock) private stocks;

    /// Contract owner
    address oracleOwner;
    
    constructor() public {
        oracleOwner = msg.sender;
    }
    
    /// Set the value of a stock
    function setStock(bytes4 symbol, uint price, uint volume) public returns (uint) {
        require(msg.sender == oracleOwner, "only owner");
        stocks[symbol] = stock(price, volume);
    }

        /// Get the value of a stock
    function getStockPrice(bytes4 symbol) public view returns (uint) {
        return stocks[symbol].price;
    }

     /// Get the value of volume traded for a stock
    function getStockVolume(bytes4 symbol) public view returns (uint) {
        return stocks[symbol].volume;
    }
}
