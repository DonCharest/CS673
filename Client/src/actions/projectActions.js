import axios from "axios";
import {
  NEW_PROJECT,
  PROJECT_SUCCESS,
  PROJECT_FAIL,
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
export const newProject = data => (dispatch, getState) => {
  // Request body
  // const body = JSON.stringify({ name, shortCode, effortunit, description, projectMembers });
  axios
    .post("api/projects", data, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: PROJECT_SUCCESS,
        payLoad: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "PROJECT_FAIL")
      );
      dispatch({
        type: PROJECT_FAIL
      });
    });
};

// Get all Projects
export const getProjects = () => (dispatch, getState) => {
  dispatch(setProjectsLoading());
  axios
    .get("/api/projects", tokenConfig(getState))
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
