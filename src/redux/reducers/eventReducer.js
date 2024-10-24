import { VIEW_EVENT } from "../actionTypes";

const initialState = {
    selectedEvent: null,
};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case VIEW_EVENT:
            return { ...state, selectedEvent: action.payload };
        default:
            return state;
    }
};

export default eventReducer;