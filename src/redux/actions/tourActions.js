import axios from 'axios';
import { FETCH_TOUR_SUCCESS, FETCH_TOUR_ERROR, SET_SELECTED_SCHEDULE } from '../actionTypes';

export const fetchTour = (tourId, token) => async (dispatch) => {
    try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`,
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        dispatch({
            type: FETCH_TOUR_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: FETCH_TOUR_ERROR,
            payload: error.message
        });
    }
};

export const setSelectedSchedule_redux = (scheduleId) => ({
    type: SET_SELECTED_SCHEDULE,
    payload: scheduleId,
});
