import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
  msg: {},
  status: null,
  id: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payLoad.msg,
        status: action.payLoad.status,
        id: action.payLoad.id
      };
    case CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null
      };
    default:
      return state;
  }
}
