import * as types from '../constants/ActionTypes';

export const setMosaic = currentNode => ({
  type: types.MOSAIC_CHANGE,
  currentNode: {...currentNode}
});
