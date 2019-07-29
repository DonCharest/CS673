import { UPDATE_ACTIVE_PROJECT } from "../actions/types";

const activeProject = (state = '', action) => {
  switch(action.type){
    case UPDATE_ACTIVE_PROJECT:
      return action.payLoad.projectId
    default:
      return state;
  }
}


export default activeProject;