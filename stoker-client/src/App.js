import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './css/style.css';
import './css/showStocks.css';
import StockList from './views/stockList.js';

class App extends Component {

  render() {
    return(
      <BrowserRouter>
        <Switch>
          <Route path="/stocks/list" component={ StockList } />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
