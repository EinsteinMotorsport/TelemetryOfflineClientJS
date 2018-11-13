import * as types from '../constants/ActionTypes'

// TODO Name
export const setMosaic = currentNode => ({
  type: types.MOSAIC_CHANGE,
  currentNode: currentNode
})

export const setTile = (index, tile) => ({
  type: types.SET_TILE,
  index,
  tile
})
