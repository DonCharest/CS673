import {
  GET_USERS,
  DELETE_USER,
  VIEW_USER,
  UPDATE_USER,
  USER_LOADING,
  USERS_LOADING
} from "../actions/types";

const initialState = {
  users: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payLoad,
        loading: false
      };
    case VIEW_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payLoad),
        loading: false
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payLoad),
        loading: false
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payLoad)
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case USERS_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
