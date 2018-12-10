import * as types from '../constants/ActionTypes'

const initialState = {
    cursorX: 4,
    domainX: [10, 50]
}

const selection = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CURSOR_X:
            return {
                ...state,
                cursorX: action.cursorX
            }

        case types.SET_DOMAIN_X:
            return {
                ...state,
                domainX: action.domainX
            }
        default:
            return state
    }
}

export default selection
