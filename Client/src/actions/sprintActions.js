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
          if (item.currentStage) {
            orderedSprint[item.currentStage.toLowerCase()].push(item)  
          } else {
            orderedSprint[item.stage[0].stageName.toLowerCase()].push(item)  
          }
          
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


export const addNewCard = (newCard,successCallback) => dispatch => {
  dispatch(setCardsLoading());
  axios
    .post("/api/cards", newCard)
    .then(res => {
        dispatch({
          type: NEW_CARD,
          payLoad: newCard
        })
        setTimeout(() => {
          dispatch(getCards())
        }, 2000)
      }
    ).then(successCallback())
    .catch(err => {
      console.error(err)
      dispatch(returnErrors(err.response.data, err.response.status))
    });
}

export const deleteCard = (cardId, successCallback) => dispatch => {
  dispatch(setCardsLoading());
  axios({method: 'delete', url: "/api/cards", data: {id: cardId}, })
    .then(res => {
        dispatch({
          type: DELETE_CARD,
          payLoad: cardId
        })

      }
    ).then(successCallback())
    .catch(err => {
      console.error(err)
      dispatch(returnErrors(err.response.data, err.response.status))
    });
}

export const editCard = (newCard,successCallback) => dispatch => {
  dispatch(setCardsLoading());
  axios
    .put("/api/cards", newCard)
    .then(res => {
        dispatch({
          type: NEW_CARD,
          payLoad: newCard
        })
        setTimeout(() => {
          dispatch(getCards())
        }, 2000)
      }
    ).then(successCallback())
    .catch(err => {
      console.error(err)
      dispatch(returnErrors(err.response.data, err.response.status))
    });
}
