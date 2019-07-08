import axios from "axios";
import {
  ADD_PROJECT,
  GET_PROJECTS,
  VIEW_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECT_LOADING,
  PROJECTS_LOADING
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

// Create new Project
export const addProject = project => (dispatch, getState) => {
  axios
    .post("api/projects", project, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_PROJECT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Get all Projects
export const getProjects = () => dispatch => {
  dispatch(setProjectsLoading());
  axios
    .get("/api/projects")
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Get=>View Project by ID
export const viewProject = id => (dispatch, getState) => {
  dispatch(setProjectLoading());
  axios
    .get(`/api/projects/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: VIEW_PROJECT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Update Project
export const updateProject = (id, data) => (dispatch, getState) => {
  axios
    .put(`/api/projects/${id}`, data, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_PROJECT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteProject = id => (dispatch, getState) => {
  axios
    .delete(`/api/projects/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_PROJECT,
        payLoad: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Load Project
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

// Load all Projects
export const setProjectsLoading = () => {
  return {
    type: PROJECTS_LOADING
  };
};
