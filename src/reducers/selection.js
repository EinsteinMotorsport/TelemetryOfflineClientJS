import * as types from '../constants/ActionTypes'

const initialState = {
    cursorX: 4,
    range: [10, 50]
}

const selection = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CURSOR_X:
            return {
                ...state,
                cursorX: action.cursorX
            }

        case types.SET_RANGE:
            return {
                ...state,
                range: action.range
            }
        default:
            return state
    }
}

export default selection
