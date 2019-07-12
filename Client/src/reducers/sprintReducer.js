import {
  ADD_NEW_CARD,
  GET_CARDS,
  CARDS_LOADING,
  NEW_CARD,
  DELETE_CARD
} from "../actions/types";


const sprint = (state = { 
  backlog:[],
  todo: [],
  workinprogress : [],
  verification: [],
  done: []
}, action) => {

  switch(action.type){
  case GET_CARDS:
    return action.payLoad
  case NEW_CARD:
    return {...state, 
      backlog: [...state.backlog, action.payLoad]
    }
  case DELETE_CARD:
    return {
      backlog: state.backlog.filter(item => item._id !== action.payload),
      todo: state.todo.filter(item => item._id !== action.payload),
      workinprogress: state.workinprogress.filter(item => item._id !== action.payload),
      verification: state.verification.filter(item => item._id !== action.payload),
      done: state.done.filter(item => item._id !== action.payload)
    }
  default:
    return state;
  }
}



export default sprint;