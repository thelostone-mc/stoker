import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './css/style.css';
import './css/showStocks.css';
import ShowStocks from './views/showStocks.js';

class App extends Component {

  render() {
    return(
      <BrowserRouter>
        <Switch>
          <Route path="/show" component={ ShowStocks } />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
