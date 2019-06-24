import { combineReducers } from 'redux'
import admin from './adminReducer'
import backlog from './backlogReducer'
import sprint from './sprintReducer'

const reducer = combineReducers({
  admin,
  backlog,
  sprint,
})

export default reducer