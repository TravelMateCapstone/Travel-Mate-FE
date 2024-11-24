import axios from 'axios';
import { UPDATE_CHAT_CONTENT, UPDATE_CHAT_HEADER } from '../actionTypes';
import { useQueryClient } from 'react-query';

// ...existing code...

export const updateChatContent = (requestId, token, ischat) => async (dispatch) => {
    try {
        if (!ischat) {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Request/${requestId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            dispatch({
                type: UPDATE_CHAT_CONTENT,
                payload: response.data,
            });
        } else {
            const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Chats/${requestId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log(response.data);
            
            dispatch({
                type: UPDATE_CHAT_CONTENT,
                payload: response.data,
            });
        }
    } catch (error) {
        console.error('Error fetching form:', error);
    }
}

export const updateChatHeader = (header) => ({
    type: UPDATE_CHAT_HEADER,
    payload: header
});

export const fetchChatAndRequestLists = (token) => async (dispatch) => {
    try {
        const [chatsResponse, requestsResponse] = await Promise.all([
            axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Chats', {
                headers: { Authorization: `${token}` }
            }),
            axios.get('https://travelmateapp.azurewebsites.net/api/ExtraFormDetails/Requests', {
                headers: { Authorization: `${token}` }
            })
        ]);

        dispatch({
            type: 'UPDATE_CHAT_LIST',
            payload: chatsResponse.data,
        });

        dispatch({
            type: 'UPDATE_REQUEST_LIST',
            payload: requestsResponse.data,
        });
    } catch (error) {
        console.error('Error fetching chat and request lists:', error);
    }
};

// ...existing code...
