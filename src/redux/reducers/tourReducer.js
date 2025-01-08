import { FETCH_TOUR_SUCCESS, FETCH_TOUR_ERROR, SET_SELECTED_SCHEDULE } from '../actionTypes';

const initialState = {
    tour: null,
    error: null,
    selectedScheduleId: null,
};

const tourReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TOUR_SUCCESS:
            return {
                ...state,
                tour: action.payload,
                error: null,
            };
        case FETCH_TOUR_ERROR:
            return {
                ...state,
                tour: null,
                error: action.payload,
            };
        case SET_SELECTED_SCHEDULE:
            return {
                ...state,
                selectedScheduleId: action.payload,
            };
        default:
            return state;
    }
};

export default tourReducer;
