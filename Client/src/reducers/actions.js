import * as ActionTypes from '../constants/actionTypes'

export const addNewStory = (newStory) => {
  return {
    type: ActionTypes.ADD_NEW_STORY,
    newStory
  }
  
}