// src/redux/reducers/modalReducer.js
import { OPEN_LOGIN_MODAL, CLOSE_LOGIN_MODAL, OPEN_REGISTER_MODAL, CLOSE_REGISTER_MODAL } from "../actionTypes";

const initialState = {
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
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
    default:
      return state;
  }
};

export default modalReducer;
