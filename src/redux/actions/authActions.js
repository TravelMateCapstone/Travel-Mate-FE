import { LOGIN_SUCCESS } from '../actionTypes';

export const loginSuccess = (token, user) => ({
  type: LOGIN_SUCCESS,
  payload: { token, user },
});
