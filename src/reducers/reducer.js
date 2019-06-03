import { combineReducers } from 'redux'
import {
  UPDATE_IMAGE,
  UPDATE_LINE
} from '../constants/actionTypes'

const main = (state={}, action) => {
  switch (action.type) {
    default:
      return state
  }
}


const reducer = combineReducers({
  main,
})

export default reducer