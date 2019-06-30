import axios from "axios";
import { GET_USERS, UPDATE_USER, DELETE_USER, USERS_LOADING } from "./types";
import { tokenConfig } from "./authActions";
import { returnErrors } from "./errorActions";

// Get all Users
export const getUsers = () => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get("/api/users")
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

export const updateUser = user => (dispatch, getState) => {
  axios
    .put("/api/users", user, tokenConfig(getState))
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

// Load all users
export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};
