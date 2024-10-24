import { VIEW_GROUP } from "../actionTypes";

const initialState = {
    selectedGroup: null,
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case VIEW_GROUP:
            return { ...state, selectedGroup: action.payload };
        default:
            return state;
    }
};

export default groupReducer;