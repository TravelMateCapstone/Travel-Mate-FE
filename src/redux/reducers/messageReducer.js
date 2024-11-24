import { FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_ERROR, VIEW_MESSAGE } from '../actionTypes';

const initialState = {
  messages: [],
  error: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
        error: null,
      };
    case FETCH_MESSAGES_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case VIEW_MESSAGE:
      return {
        ...state,
        currentMessage: action.payload,
      };
    default:
      return state;
  }
};

export default messageReducer;
