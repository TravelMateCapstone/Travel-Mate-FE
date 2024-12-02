import axios from 'axios';
import { FETCH_TOUR_SUCCESS, FETCH_TOUR_ERROR } from '../actionTypes';

export const fetchTour = (tourId) => async (dispatch) => {
    try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/${tourId}`);
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