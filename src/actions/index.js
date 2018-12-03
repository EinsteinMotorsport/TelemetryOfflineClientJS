/**
 * "Actions are payloads of information that send data from your application to your store. 
 *  They are the only source of information for the store. 
 *  You send them to the store using store.dispatch()."
 *  https://redux.js.org/basics/actions
 */

import * as types from '../constants/ActionTypes'

export const setTilePositions = tilePositions => ({
    type: types.SET_TILE_POSITIONS,
    tilePositions
})

export const setTileSettings = (tileId, value) => ({
    type: types.SET_TILE_SETTINGS,
    tileId,
    value
})

export const addTile = (tileSettings, path = null) => ({
    type: types.ADD_TILE,
    tileSettings,
    path
})

export const toggleSettingsPopUp = (tileId) => ({
    type: types.TOGGLE_SETTINGS_POP_UP,
    tileId
})

export const setCursorX = (cursorX) => ({
    type: types.SET_CURSOR_X,
    cursorX
})

export const setRange = (range) => ({
    type: types.SET_RANGE,
    range
})
