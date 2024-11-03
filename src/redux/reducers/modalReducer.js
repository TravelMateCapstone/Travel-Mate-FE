// src/redux/reducers/modalReducer.js
import { OPEN_LOGIN_MODAL, CLOSE_LOGIN_MODAL, OPEN_REGISTER_MODAL, CLOSE_REGISTER_MODAL, OPEN_FORM_SUBMIT_MODAL, CLOSE_FORM_SUBMIT_MODAL } from "../actionTypes";

const initialState = {
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isFormSubmitModalOpen: false,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_LOGIN_MODAL:
      return { ...state, isLoginModalOpen: true };
    case CLOSE_LOGIN_MODAL:
      return { ...state, isLoginModalOpen: false };
    case OPEN_REGISTER_MODAL:
      return { ...state, isRegisterModalOpen: true };
    case CLOSE_REGISTER_MODAL:
      return { ...state, isRegisterModalOpen: false };
      case OPEN_FORM_SUBMIT_MODAL:
        return { ...state, isFormSubmitModalOpen: true };
      case CLOSE_FORM_SUBMIT_MODAL:
        return { ...state, isFormSubmitModalOpen: false };
    default:
      return state;
  }
};

export default modalReducer;
