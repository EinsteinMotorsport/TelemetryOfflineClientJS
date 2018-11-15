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

export const addTile = (tileSettings = {}, path = null) => ({
    type: types.ADD_TILE,
    tileSettings,
    path
})
