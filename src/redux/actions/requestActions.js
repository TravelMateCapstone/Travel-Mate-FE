import { VIEW_REQUEST, SELECTED_REQUEST } from '../actionTypes';
import axios from 'axios';

// ...existing code...

export const viewRequest = (requestId, token) => async (dispatch) => {
  try {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Request/${requestId}`, {
      headers: {
        Authorization: `${token}`
      }
    });
    dispatch({
      type: VIEW_REQUEST,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching form:', error);
  }
};
export const selectRequest = (request) => async (dispatch) => {
  try {
    dispatch({
      type: SELECTED_REQUEST,
      payload: request,
    });
  } catch (error) {
    console.error('Error sending request:', error);
  }
}