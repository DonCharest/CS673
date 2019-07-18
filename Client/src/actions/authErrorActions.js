import { GET_ERRORS, CLEAR_ERRORS } from "./types";

// RETURN ERRORS
export const returnErrors = (msg, status, id = null) => {
  return {
    type: GET_ERRORS,
    payLoad: { msg, status, id }
  };
};

// CLEAR ERRORS
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
