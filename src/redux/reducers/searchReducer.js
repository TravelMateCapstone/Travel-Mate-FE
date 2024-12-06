import { SEARCH_TOUR } from "../actionTypes";

const initialState = {
    searchKey: '',
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_TOUR:
            return {
                ...state,
                searchKey: action.payload,
            };
        // ...existing code...
        default:
            return state;
    }
};

export default searchReducer;

