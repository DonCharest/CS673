import {
  GET_PROJECTS,
  VIEW_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECT_LOADING,
  PROJECTS_LOADING
} from "../actions/types";

const initialState = {
  projects: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payLoad,
        loading: false
      };
    case VIEW_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project._id !== action.payLoad
        ),
        loading: false
      };
    case UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project._id !== action.payLoad
        ),
        loading: false
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project._id !== action.payLoad
        )
      };
    case PROJECT_LOADING:
      return {
        ...state,
        loading: true
      };
    case PROJECTS_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}