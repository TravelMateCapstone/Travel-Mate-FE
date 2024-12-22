import { SET_CHAT_CONNECTION } from '../actionTypes';

const initialState = {
  connection: null,
};

const chatHubReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_CONNECTION:
      return {
        ...state,
        connection: action.payload,
      };
    // ...existing code...
    default:
      return state;
  }
};

export default chatHubReducer;
