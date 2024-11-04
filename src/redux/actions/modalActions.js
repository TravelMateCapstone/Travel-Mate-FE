// modalActions.js
import { OPEN_LOGIN_MODAL, CLOSE_LOGIN_MODAL, OPEN_FORM_SUBMIT_MODAL, CLOSE_FORM_SUBMIT_MODAL } from "../actionTypes";
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


  export const openFormSubmitModal = () => ({
    type: OPEN_FORM_SUBMIT_MODAL,
  });
  
  export const closeFormSubmitModal = () => ({
    type: CLOSE_FORM_SUBMIT_MODAL,
  });