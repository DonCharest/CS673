import { combineReducers } from "redux";
import userReducer from "./userReducer";
import itemReducer from "./itemReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import admin from "./adminReducer";
import backlog from "./backlogReducer";
import sprint from "./sprintReducer";

const rootReducer = combineReducers({
  user: userReducer,
  item: itemReducer,
  error: errorReducer,
  auth: authReducer,
  admin,
  backlog,
  sprint
});

export default rootReducer;
