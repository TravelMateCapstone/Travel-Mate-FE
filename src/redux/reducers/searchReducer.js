import { SEARCH } from "../actionTypes";

const initialState = {
    searchKey: '',
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH:
            return {
                ...state,
                searchKey: action.payload,
            };
        default:
            return state;
    }
};

export default searchReducer;

