import { UPDATE_ACTIVE_PROJECT} from "./types";

// RETURN ERRORS
export const updateActiveProject = (projectId) => {
  return {
    type: UPDATE_ACTIVE_PROJECT,

    payLoad: { 
      projectId,
    }
  };
};