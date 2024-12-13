import { VIEW_PROFILE, VIEW_PROFILE_LOADING, VIEW_PROFILE_ERROR, CLEAR_TRIP, DELETE_POST, UPDATE_POST } from "../actionTypes";

const initialState = {
  profile: null,
  home: null,
  activities: null,
  friends: null,
  location: null,
  education: null,
  languages: null,
  trip: null,
  tour: null,
  loading: {
    profile: false,
    home: false,
    activities: false,
    friends: false,
    location: false,
    education: false,
    languages: false,
    trip: false,
    tour: false
  },
  error: {
    profile: null,
    home: null,
    activities: null,
    friends: null,
    location: null,
    education: null,
    languages: null,
    trip: null,
    tour: null
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
    case CLEAR_TRIP:
      return {
        ...state,
        trip: null,
        loading: {
          ...state.loading,
          trip: false,
        },
        error: {
          ...state.error,
          trip: null,
        }
      };
    case DELETE_POST:
      return {
        ...state,
        trip: {
          ...state.trip,
          $values: state.trip.$values.filter(post => post.pastTripPostId !== action.payload.postId)
        }
      };
    case UPDATE_POST:
      return {
        ...state,
        trip: {
          ...state.trip,
          $values: state.trip.$values.map(post => 
            post.pastTripPostId === action.payload.postId ? { ...post, ...action.payload.data } : post
          )
        }
      };
    default:
      return state;
  }
};

export default profileReducer;