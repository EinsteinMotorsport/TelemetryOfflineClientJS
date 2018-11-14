import {
    getNodeAtPath,
    getPathToCorner,
    getOtherDirection,
    Corner,
    updateTree
} from 'react-mosaic-component'

import * as types from '../constants/ActionTypes'

const initialState = {
    currentNode: null,
    tiles: []
}

const generateId = tiles => {
    let i = 0
    while (tiles[i])
        i++
    return i
}

const addTile = (state, action) => {
    const id = generateId(state.tiles)
    const tiles = [...state.tiles]
    tiles[id] = action.tile
    if (state.currentNode == null) {
        return {
            ...state,
            tiles,
            currentNode: id
        }
    }
    // Größtenteils übernommen von https://github.com/palantir/react-mosaic/blob/25d29c20bcbf62161c873f3af7ef5addb623f297/demo/ExampleApp.tsx#L126
    const path = action.path != null ? action.path : getPathToCorner(state.currentNode, Corner.TOP_RIGHT)
    const parent = getNodeAtPath(state.currentNode, path.slice(0, -1))
    const destination = getNodeAtPath(state.currentNode, path)
    const direction = parent ? getOtherDirection(parent.direction) : 'row'
    let first
    let second
    if (direction === 'row') {
        first = destination
        second = id
    } else {
        first = id
        second = destination
    }
    const currentNode = updateTree(state.currentNode, [{
        path,
        spec: {
            $set: {
                direction,
                first,
                second
            }
        }
    }])
    return {
        ...state,
        tiles,
        currentNode
    }
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
        case types.ADD_TILE:
            return addTile(state, action)
        default:
            return state
    }
}

export default workspace
