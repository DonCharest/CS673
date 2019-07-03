import axios from "axios";
import {
  GET_USERS,
  VIEW_USER,
  UPDATE_USER,
  DELETE_USER,
  USER_LOADING,
  USERS_LOADING
} from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

// Get all Users
export const getUsers = () => (dispatch, getState) => {
  dispatch(setUsersLoading());
  axios
    .get("/api/users", tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_USERS,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Get=>View User by ID
export const viewUser = id => (dispatch, getState) => {
  dispatch(setUserLoading());
  axios
    .get(`/api/users/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: VIEW_USER,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Update User Role
export const updateUser = (id, data) => (dispatch, getState) => {
  axios
    .put(`/api/users/${id}`, data, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: UPDATE_USER,
        payLoad: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteUser = id => (dispatch, getState) => {
  axios
    .delete(`/api/users/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_USER,
        payLoad: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

// Load user
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Load all users
export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};
