import { UPDATE_CHAT_CONTENT, UPDATE_CHAT_HEADER } from '../actionTypes';

const initialState = {
    chatHeader: null,
    chatContent: null
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        // ...existing cases...
        case UPDATE_CHAT_CONTENT:
            return {
                ...state,
                chatContent: action.payload
            };
        case UPDATE_CHAT_HEADER:
            return {
                ...state,
                chatHeader: action.payload
            };
        case 'UPDATE_CHAT_LIST':
            return {
                ...state,
                chatList: action.payload
            };
        case 'UPDATE_REQUEST_LIST':
            return {
                ...state,
                requestList: action.payload
            };
        // ...existing cases...
        default:
            return state;
    }
};

export default chatReducer;
