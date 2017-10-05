import React, { Component } from 'react';
const io = require('socket.io-client');
const reactable = require("reactable");

const socket = io.connect('http://localhost:3001');
const Table = reactable.Table,
      Thead = reactable.Thead,
      Th = reactable.Th;

class StockList extends Component {

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
        <Table className="table table-minimal" id="stockTable" data={this.state.stockList}
          sortable defaultSort={{column: 'symbol'}} filterable={[
            'symbol',
            {
              column: 'underlyingStock',
              filterFunction: (contents, filter) => {
                const content = parseFloat(contents);
                if(filter.startsWith("price >")) {
                  const digits = parseFloat(filter.replace( /^\D+/g, ''));
                  return (content >= digits);
                } else if(filter.startsWith("price <")) {
                  const digits = parseFloat(filter.replace( /^\D+/g, ''));
                  return (content <= digits);
                }
              }
            },
            {
              column: 'avgCallsIV',
              filterFunction: (contents, filter) => {
                const content = parseFloat(contents);
                if(filter.startsWith("calls >")) {
                  const digits = parseFloat(filter.replace( /^\D+/g, ''));
                  return (content >= digits);
                } else if(filter.startsWith("calls <")) {
                  const digits = parseFloat(filter.replace( /^\D+/g, ''));
                  return (content <= digits);
                }
              }
            },
            {
              column: 'avgPutsIV',
              filterFunction: (contents, filter) => {
                const content = parseFloat(contents);
                if(filter.startsWith("puts >")) {
                  const digits = parseFloat(filter.replace( /^\D+/g, ''));
                  return (content >= digits);
                } else if(filter.startsWith("puts <")) {
                  const digits = parseFloat(filter.replace( /^\D+/g, ''));
                  return (content <= digits);
                }
              }
            }
          ]}>
          <Thead>
            <Th column="symbol">Stock</Th>
            <Th column="underlyingStock">Current Price</Th>
            <Th column="avgCallsIV">Avg PutsIV</Th>
            <Th column="avgPutsIV">Avg CallsIV</Th>
          </Thead>
        </Table>
      </div>
    );
  }
}

export default StockList;
