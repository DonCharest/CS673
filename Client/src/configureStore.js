import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";


const configureStore = () => {
  const initialState = {};
  const middleware = [thunk];

  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
  )
};

export default configureStore;
