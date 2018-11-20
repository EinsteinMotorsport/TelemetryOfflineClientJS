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

export const setTileSettings = (index, value) => ({
    type: types.SET_TILE_SETTINGS,
    index,
    value
})

export const addTile = (tileSettings = { type: Math.random() < 0.5 ? 'LineGraph' : 'OverviewGraph', channel: Math.floor(Math.random() * 128) + 2 }, path = null) => ({
    type: types.ADD_TILE,
    tileSettings,
    path
})
