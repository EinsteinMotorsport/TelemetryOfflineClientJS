import {
    getNodeAtPath,
    getPathToCorner,
    getOtherDirection,
    Corner,
    updateTree
} from 'react-mosaic-component'

import * as types from '../constants/ActionTypes'

const initialState = {
    tilePositions: null,
    tileSettings: []
}

/**
 * Finde nächste verfügbare ID
 * @param {*[]} tileSettings 
 */
const generateId = tileSettings => {
    let i = 0
    while (tileSettings[i])
        i++
    return i
}

const addTile = (state, action) => {
    const id = generateId(state.tileSettings)
    // Aktuelle tileSettings kopieren
    const tileSettings = [...state.tileSettings]
    tileSettings[id] = action.tileSettings
    if (state.tilePositions == null) { // Wenn aktuell kein Tile existiert
        return {
            ...state,
            tileSettings,
            tilePositions: id
        }
    }

    // Neues Tile rechts oben einfügen. Größtenteils übernommen von https://github.com/palantir/react-mosaic/blob/25d29c20bcbf62161c873f3af7ef5addb623f297/demo/ExampleApp.tsx#L126
    const path = action.path != null ? action.path : getPathToCorner(state.tilePositions, Corner.TOP_RIGHT)
    const parent = getNodeAtPath(state.tilePositions, path.slice(0, -1))
    const destination = getNodeAtPath(state.tilePositions, path)
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
    const tilePositions = updateTree(state.tilePositions, [{
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
        tileSettings,
        tilePositions
    }
}



const workspace = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_TILE_POSITIONS:
            return {
                ...state,
                tilePositions: action.tilePositions
            }

        case types.SET_TILE_SETTINGS:
            const tileSettings2 = [...state.tileSettings]
            tileSettings2[action.index] = action.value
            return {
                ...state,
                tileSettings2
            }
        case types.ADD_TILE:
            return addTile(state, action)
        default:
            return state
    }
}

export default workspace
