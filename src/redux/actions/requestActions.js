import { VIEW_REQUEST } from '../actionTypes';
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
