import { VIEW_GROUP, REFRESH_GROUPS, UPDATE_GROUP } from "../actionTypes";

const initialState = {
    selectedGroup: null,
    refreshGroups: false,
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case VIEW_GROUP:
            return { ...state, selectedGroup: action.payload.group, userJoinedStatus: action.payload.userJoinedStatus };
        case REFRESH_GROUPS:
            return { ...state, refreshGroups: !state.refreshGroups };
        case UPDATE_GROUP:
            return { ...state, selectedGroup: { ...state.selectedGroup, ...action.payload.updatedGroup } };
        default:
            return state;
    }
};

export default groupReducer;