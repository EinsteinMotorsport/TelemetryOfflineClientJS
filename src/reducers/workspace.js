import * as types from '../constants/ActionTypes'

const initialState = {
    currentNode: null,
    tiles: []
}

const workspace = (state = initialState, action) => {
    switch (action.type) {
        case types.MOSAIC_CHANGE:
            return {
                ...state,
                currentNode: action.currentNode
            }
            
        case types.SET_TILE:
            const tiles = [...state.tiles]
            tiles[action.index] = action.tile
            return {
                ...state,
                tiles
            }
        default:
            return state
    }
}

export default workspace
