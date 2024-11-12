import { LOGIN_SUCCESS, LOGOUT, UPDATE_USER_AVATAR } from "../actionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user, // Thông tin người dùng
        token: action.payload.token, // Lưu token
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null, // Xóa token khi logout
      };
    case UPDATE_USER_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatarUrl: action.payload, // Cập nhật avatarUrl
        },
      };


    default:
      return state;
  }
};

export default authReducer;
