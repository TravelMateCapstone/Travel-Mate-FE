import { VIEW_PROFILE, VIEW_PROFILE_LOADING, VIEW_PROFILE_ERROR } from "../actionTypes";

const initialState = {
  profile: null,
  home: null,
  activities: null,
  friends: null,
  location: null,
  education: null,
  languages: null,
  loading: {
    profile: false,
    home: false,
    activities: false,
    friends: false,
    location: false,
    education: false,
    languages: false,
  },
  error: {
    profile: null,
    home: null,
    activities: null,
    friends: null,
    location: null,
    education: null,
    languages: null,
  }
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_PROFILE_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.property]: true,
        },
        error: {
          ...state.error,
          [action.payload.property]: null,
        }
      };
    case VIEW_PROFILE:
      return {
        ...state,
        [action.payload.property]: action.payload.data,
        loading: {
          ...state.loading,
          [action.payload.property]: false,
        }
      };
    case VIEW_PROFILE_ERROR:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.property]: false,
        },
        error: {
          ...state.error,
          [action.payload.property]: action.payload.error,
        }
      };
    default:
      return state;
  }
};

export default profileReducer;