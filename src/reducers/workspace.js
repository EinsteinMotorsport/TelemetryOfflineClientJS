import * as types from '../constants/ActionTypes';

const initialState = {
    currentNode: {
        direction: 'row',
        first: 0,
        second: {
            direction: 'column',
            first: 1,
            second: 2,
        },
    },
    tiles: [{}, {}, {}]
};

const workspace = (state = initialState, action) => {
    switch (action.type) {
        case types.MOSAIC_CHANGE:
            return {
                ...state,
                currentNode: action.currentNode
            };
            
        default:
            return state;
    }
};

export default workspace;
