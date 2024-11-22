import { VIEW_PROFILE, VIEW_PROFILE_LOADING, VIEW_PROFILE_ERROR } from "../actionTypes";
import axios from 'axios';

// Action creator for viewing profile
export const viewProfile = (userId) => async (dispatch) => {
  const requests = {
    profile: () => axios.get(`https://travelmateapp.azurewebsites.net/api/Profile/${userId}`),
    home: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserHome/user/${userId}`),
    activities: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserActivitiesWOO/user/${userId}`),
    friends: () => axios.get(`https://travelmateapp.azurewebsites.net/api/Friendship/List-friends/${userId}`),
    location: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserLocationsWOO/user/${userId}`),
    education: () => axios.get(`https://travelmateapp.azurewebsites.net/api/UserEducation/user/${userId}`),
    languages: () => axios.get(`https://travelmateapp.azurewebsites.net/api/SpokenLanguages/user/${userId}`)
  };

  const properties = Object.keys(requests);

  for (const prop of properties) {
    dispatch({ type: VIEW_PROFILE_LOADING, payload: { property: prop } });

    try {
      const response = await requests[prop]();
      dispatch({
        type: VIEW_PROFILE,
        payload: { property: prop, data: response.data }
      });
    } catch (error) {
      dispatch({
        type: VIEW_PROFILE_ERROR,
        payload: { property: prop, error: error.message }
      });
      console.error(`Error fetching ${prop} data`, error);
    }
  }
};