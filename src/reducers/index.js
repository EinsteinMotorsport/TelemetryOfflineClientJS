/**
 * "Reducers specify how the application's state changes in response to actions sent to the store.
 *  Remember that actions only describe what happened, but don't describe how the application's state changes."
 *  https://redux.js.org/basics/reducers
 */

import { combineReducers } from 'redux'

import workspace from './workspace'

export default combineReducers({
    workspace
})
