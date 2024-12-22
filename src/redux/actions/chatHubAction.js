import { SET_CHAT_CONNECTION } from '../actionTypes';

export const setChatConnection = (connection) => ({
  type: SET_CHAT_CONNECTION,
  payload: connection,
});
