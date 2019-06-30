import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";
import { HashRouter } from "react-router-dom";
import Main from "./containers/Main";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    // const reducerStore = store();
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
