import React, {Component} from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import { createStore } from 'redux'

import reducer from './reducers/reducer'
import Main from './containers/Main';

import './app.css';


function App() {

  const store = createStore(reducer)
  
  return (
    <Provider store={store}>
      <div> 
        <Main />  
      </div>
    </Provider>
  );
}

export default App;





