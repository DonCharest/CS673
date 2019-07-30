import { combineReducers } from "redux";
import userReducer from "./userReducer";
import authErrorReducer from "./authErrorReducer";
import appErrorReducer from "./appErrorReducer";
import authReducer from "./authReducer";
import admin from "./adminReducer";
import backlog from "./backlogReducer";
import sprint from "./sprintReducer";
import projectReducer from "./projectReducer";
import activeProject from "./activeProject";

// const rootReducer = combineReducers({
//   user: userReducer,
//   error: errorReducer,
//   auth: authReducer,
//   project: projectReducer,
//   admin,
//   backlog,
//   sprint
// });
// export default rootReducer;

export default combineReducers({
  activeProject: activeProject,
  user: userReducer,
  authError: authErrorReducer,
  auth: authReducer,
  project: projectReducer,
  appError: appErrorReducer,
  admin,
  backlog,
  sprint
});
