import React, { Component } from 'react';
const io = require('socket.io-client');

const socket = io.connect('http://localhost:3001');

class ShowStocks extends Component {

  state = {
    symbols: [],
    stockList: [{}]
  }

  componentDidMount() {
    socket.on('stocks', (data) => {
      let symbols = [], stocks = [];
      data.stocks.forEach((stock) => {
        symbols.push(stock.symbol);
        stocks.push(stock);
      });
      this.setState({symbols: symbols, stockList: stocks});
    });
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.stocks}</h1>
        <table className="table-minimal">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Current Price</th>
              <th>Avg PutsIV</th>
              <th>Avg CallsIV</th>
            </tr>
          </thead>
          <tbody>
            {this.state.symbols.map((symbol, key) =>
              <tr key={key}>
                <td>{this.state.stockList[key].symbol}</td>
                <td>{this.state.stockList[key].underlyingStock}</td>
                <td>{this.state.stockList[key].avgCallsIV}</td>
                <td>{this.state.stockList[key].avgPutsIV}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ShowStocks;
