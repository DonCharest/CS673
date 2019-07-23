import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./configureStore";

import { HashRouter } from "react-router-dom";
import Main from "./containers/Main";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    const store = configureStore();
    return (
      <Provider store={store}>
        <div>
          <HashRouter>
            <Main />
          </HashRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
