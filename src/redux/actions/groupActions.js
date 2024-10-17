import { VIEW_GROUP } from "../actionTypes";

export const viewGroup = (groupDetails) => ({
    type: VIEW_GROUP,
    payload: groupDetails,
  });