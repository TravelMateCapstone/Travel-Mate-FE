// modalActions.js
import { OPEN_LOGIN_MODAL, CLOSE_LOGIN_MODAL } from "../actionTypes";
import { OPEN_REGISTER_MODAL, CLOSE_REGISTER_MODAL } from "../actionTypes";

export const openLoginModal = () => ({
  type: OPEN_LOGIN_MODAL,
});

export const closeLoginModal = () => ({
  type: CLOSE_LOGIN_MODAL,
});

export const openRegisterModal = () => ({
    type: OPEN_REGISTER_MODAL,
  });
  
  export const closeRegisterModal = () => ({
    type: CLOSE_REGISTER_MODAL,
  });
