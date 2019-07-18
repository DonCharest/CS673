import { SET_APP_ERRORS, CLEAR_APP_ERRORS } from "../actions/types";

const initialState = {
  location: '',
  statusCode: '',
  msg: '',
  showModal: false,
  title: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_APP_ERRORS:
      return {
        location: action.payLoad.location,
        statusCode: action.payLoad.statusCode,
        msg: action.payLoad.msg,
        title: action.payLoad.title,
        showModal: true,
      };
    case CLEAR_APP_ERRORS:
      return initialState
    default:
      return state;
  }
}
