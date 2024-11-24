import { VIEW_REQUEST } from '../actionTypes';

const initialState = {
  currentRequest: null,
};

const requestReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_REQUEST:
      return {
        ...state,
        currentRequest: action.payload,
      };
    default:
      return state;
  }
};

export default requestReducer;
