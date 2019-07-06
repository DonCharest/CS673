import { combineReducers } from "redux";
import userReducer from "./userReducer";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import admin from "./adminReducer";
import backlog from "./backlogReducer";
import sprint from "./sprintReducer";
import projectReducer from "./projectReducer";

const rootReducer = combineReducers({
  user: userReducer,
  error: errorReducer,
  auth: authReducer,
  project: projectReducer,
  admin,
  backlog,
  sprint
});

export default rootReducer;
