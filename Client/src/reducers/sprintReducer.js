import {
    ADD_NEW_STORY
} from '../constants/actionTypes';


const sprint = (state = {todo: [], wip: [], verification: [], complete: []}, action) => {
  switch(action.type){
    case ADD_NEW_STORY:
        return {...state, 
            todo: [...state.todo, action.newStory]
        }
    default:
      return state;
  }
}



export default sprint;