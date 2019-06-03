import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import { createStore } from 'redux'

import reducer from './reducers/reducer'
import Main from './containers/Main';

import './app.css';

const store = createStore(reducer)

render(
  <Provider store={store}>
  <div> 
    <Main />  
  </div>
  </Provider>, 
  document.getElementById('content')
);