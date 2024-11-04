import { VIEW_GROUP, REFRESH_GROUPS } from "../actionTypes";

const initialState = {
    selectedGroup: null,
    refreshGroups: false,
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case VIEW_GROUP:
            return { ...state, selectedGroup: action.payload };
        case REFRESH_GROUPS:
            return { ...state, refreshGroups: !state.refreshGroups };
        default:
            return state;
    }
};

export default groupReducer;