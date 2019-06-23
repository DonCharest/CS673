import React, { Component } from "react";
import AppNavbar from "./containers/appNavbar/AppNavbar";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
        </div>
      </Provider>
    );
  }
}

export default App;

/*
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import { createStore } from 'redux'
import { HashRouter} from 'react-router-dom';
import reducer from './reducers/reducer'
import Main from './containers/Main';

import './app.css';


function App() {

  const store = createStore(reducer)
  
  return (
    <Provider store={store}>
       <HashRouter>
        <Main />  
      </HashRouter>
    </Provider>
  );
}

export default App;
*/
