import { SELECTED_REQUEST, VIEW_REQUEST } from '../actionTypes';

const initialState = {
  currentRequest: null,
  selectedRequest: null,
};

const requestReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_REQUEST:
      return {
        ...state,
        currentRequest: action.payload,
      };
    case SELECTED_REQUEST:
      return {
        ...state,
        selectedRequest: action.payload,
      };
    default:
      return state;
  }
};

export default requestReducer;
