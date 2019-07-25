import axios from "axios";
import {
  ADD_PROJECT,
  GET_PROJECTS,
  VIEW_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECT_LOADING,
  PROJECTS_LOADING,
  ADD_MEMBERS,
  ADD_EPICS,
  DELETE_EPIC,
  DELETE_MEMBER,
  START_SPRINT,
  STOP_SPRINT,
  GET_SPRINT,
  UPDATE_SPRINT,
  SPRINT_LOADING
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./authErrorActions";

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
//export const updateProject = (id, data) => (dispatch, getState) => {
export const updateProject = data => dispatch => {
  axios
    // .put(`/api/projects/${id}`, data, tokenConfig(getState))
    .put(`api/projects`, data)
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

// Update Project to add members
//export const addProjectMembers = (id, data) => (dispatch, getState) => {
export const addProjectMembers = data => dispatch => {
  axios
    // .put(`/api/projects/${id}`, data, tokenConfig(getState))
    .put(`api/projectuser`, data)
    .then(res =>
      dispatch({
        type: ADD_MEMBERS,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Delete Member from Project
export const deleteMember = (id, projID) => dispatch => {
  axios
    .delete(`/api/projectuser`, {
      data: {
        projectID: projID,
        projectMembers: id
      }
    })
    .then(res =>
      dispatch({
        type: DELETE_MEMBER,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Add Epic to Project
export const addEpics = epic => dispatch => {
  axios
    .post("api/epic", epic)
    .then(res =>
      dispatch({
        type: ADD_EPICS,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Delete Epic from Project
export const deleteEpic = (id, projID) => dispatch => {
  axios
    .delete(`/api/epic`, {
      data: {
        projectID: projID,
        epics: id
      }
    })
    .then(res =>
      dispatch({
        type: DELETE_EPIC,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Delete a Project
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

//******************* */ New Sprint API Calls: **************************//

// Start Sprint
export const startSprint = sprint => (dispatch, getState) => {
  axios
    .post("api/sprint", sprint, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: START_SPRINT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Stop Sprint
///**  */PUT api/card, body {project: project._id, sprint: null}
export const stopSprint = data => (dispatch, getState) => {
  axios
    .put("api/cards", data, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: STOP_SPRINT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Get Sprint => by ID   ******* I may not need this ???
export const getSprint = id => (dispatch, getState) => {
  dispatch(setSprintLoading());
  axios
    .get(`/api/sprint/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_SPRINT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Update Sprint
//export const updateSprint = (id, data) => (dispatch, getState) => {
export const updateSprint = data => dispatch => {
  axios
    // .put(`/api/sprint/${id}`, data, tokenConfig(getState))
    .put(`api/sprint`, data)
    .then(res =>
      dispatch({
        type: UPDATE_SPRINT,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Load Sprint
export const setSrintLoading = () => {
  return {
    type: SPRINT_LOADING
  };
};
