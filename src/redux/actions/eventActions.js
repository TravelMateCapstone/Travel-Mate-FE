import { VIEW_EVENT } from "../actionTypes";

export const viewEvent = (eventDetails) => ({
  type: VIEW_EVENT,
  payload: eventDetails,
});