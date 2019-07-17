import { SET_APP_ERRORS, CLEAR_APP_ERRORS } from "./types";

// RETURN ERRORS
export const returnErrors = ({location = '', statusCode = '', msg = '', title = ''}) => {
  return {
  type: SET_APP_ERRORS,

  payLoad: { 
      location,
      statusCode,
      msg,
      title, 
    }
  };
};

// CLEAR ERRORS
export const clearErrors = () => {
  return {
  type: CLEAR_APP_ERRORS
  };
};
