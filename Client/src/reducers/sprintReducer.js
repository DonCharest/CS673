import {
    ADD_NEW_CARD,
    GET_CARDS,
    CARDS_LOADING,
    NEW_CARD
} from "../actions/types";


const sprint = (state = { backlog:[],
          todo: [],
          workinprogress : [],
          verification: [],
          done: []}, action) => {
  switch(action.type){
    case GET_CARDS:
        return action.payLoad
    case NEW_CARD:
        console.log(action.payLoad)
        return {...state, 
            backlog: [...state.backlog, action.payLoad]
        }
    default:
      return state;
  }
}



export default sprint;