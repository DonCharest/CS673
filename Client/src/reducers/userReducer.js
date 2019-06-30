import {
  GET_USERS,
  DELETE_USER,
  UPDATE_USER,
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
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payLoad)
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payLoad)
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
