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





