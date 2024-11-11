import { LOGIN_SUCCESS, LOGOUT, UPDATE_USER_AVATAR } from '../actionTypes';

// Action creator for logging in
export const loginSuccess = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userData
  };
};

export const logout = () => {
  return {
    type: LOGOUT
  };
};
export const updateUserAvatar = (avatarUrl) => ({
  type: UPDATE_USER_AVATAR,
  payload: avatarUrl,
});