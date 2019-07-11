import axios from "axios";
import {
  GET_CARDS,
  NEW_CARD,
  CARDS_LOADING
} from "./types";
import { returnErrors } from "./errorActions";

// Get all Cards
export const getCards = () => dispatch => {
  dispatch(setCardsLoading());
  axios
    .get("/api/sprint")
    .then(res => {
        // format data for sprint
        const orderedSprint = {
          backlog:[],
          todo: [],
          workinprogress : [],
          verification: [],
          done: [],
        } ;
        res.data.forEach( (item) => {
          orderedSprint[item.stage[0].stageName.toLowerCase()].push(item)
        })

        dispatch({
          type: GET_CARDS,
          payLoad: orderedSprint
        })
      }
    )
    .catch(err => {
      console.error(err)
      dispatch(returnErrors(err.response.data, err.response.status))
    });
};

// Load all Projects
export const setCardsLoading = () => {
  return {
    type: CARDS_LOADING
  };
};


export const addNewCard = (newCard) => dispatch => {
  dispatch(setCardsLoading());
  axios
    .post("/api/cards", newCard)
    .then(res => {
        dispatch({
          type: NEW_CARD,
          payLoad: newCard
        })
      }
    )
    .catch(err => {
      console.error(err)
      dispatch(returnErrors(err.response.data, err.response.status))
    });
}