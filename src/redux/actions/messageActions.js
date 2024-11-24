import axios from 'axios';
import { useQuery } from 'react-query';
import { FETCH_MESSAGES_SUCCESS, FETCH_MESSAGES_ERROR, VIEW_MESSAGE } from '../actionTypes';

// ...existing code...

export const fetchMessages = (formId, token) => {
  return useQuery(['messages', formId], async () => {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Chats/${formId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    
    return response.data;
  }, {
    onSuccess: (data) => {
      dispatch({
        type: FETCH_MESSAGES_SUCCESS,
        payload: data,
      });
    },
    onError: (error) => {
      dispatch({
        type: FETCH_MESSAGES_ERROR,
        payload: error.message,
      });
    }
  });
};

export const viewMessage = (formId, token) => async (dispatch) => {
  try {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Chats/${formId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    console.log('Messages:', response.data);
    dispatch({
      type: VIEW_MESSAGE,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching message by ID:', error);
  }
};
