import axios from "axios";
import {
  GET_CARDS,
  NEW_CARD,
  CARDS_LOADING,
  DELETE_CARD
} from "./types";
import { returnErrors } from "./appErrorActions";

// Get all Cards
export const getCards = (projectId = null) => (dispatch, getState) => {
  dispatch(setCardsLoading());


  let projectIdFilter = projectId;

  if (projectIdFilter === null) {
    projectIdFilter = getState().activeProject
  }


  axios
    .get(`/api/cards?project=${projectIdFilter}`)
    .then(res => {
        // format data for sprint
        const orderedSprint = {
          backlog:[],
          todo: [],
          workinprogress : [],
          verification: [],
          done: [],
        } ;
        res.data.cards.forEach( (item) => {
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
      const errorObj = {
        location: "retrieving a story",
        statusCode: err.response.status || '',
        msg: err.response.statusText || '',
        title: "Error on Retrieve"
      }
      dispatch(returnErrors(errorObj))
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
      const errorObj = {
        location: "creating a story",
        statusCode: err.response.status || '',
        msg: err.response.statusText || '',
        title: "Error on Create"
      }
      dispatch(returnErrors(errorObj))
    });
}

export const deleteCard = (cardId, successCallback) => dispatch => {
  dispatch(setCardsLoading());
  axios({method: 'delete', url: `/api/cards?id=${cardId}` })
    .then(res => {
        dispatch({
          type: DELETE_CARD,
          payLoad: res.data.cards._id
        })
      }
    ).then(successCallback())
    .catch(err => {
      const errorObj = {
        location: "deleting a story",
        statusCode: err.response.status || '',
        msg: err.response.statusText || '',
        title: "Error on Delete"
      }
      dispatch(returnErrors(errorObj))
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
      const errorObj = {
        location: "editing a story",
        statusCode: err.response.status || '',
        msg: err.response.statusText || '',
        title: "Error on Edit Story"
      }
      dispatch(returnErrors(errorObj))
    });
}


export const updateStage = (id, newStage) => dispatch => {
    dispatch(setCardsLoading());
    const data = {
      id,
      stageName: newStage.toUpperCase()
    }
    axios
      .put("/api/stagechange", data)
      .then(res => {
          setTimeout(() => {
            dispatch(getCards())
          }, 2000)
        }
      )
      .catch(err => {
        const errorObj = {
        location: "Changing stage",
        statusCode: err.response.status || '',
        msg: err.response.statusText || '',
        title: "Error on Change Stage"
      }
      dispatch(returnErrors(errorObj))
      });
  }