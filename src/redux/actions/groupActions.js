import { VIEW_GROUP, REFRESH_GROUPS } from "../actionTypes";

export const viewGroup = (groupDetails) => ({
  type: VIEW_GROUP,
  payload: groupDetails,
});

export const refreshGroups = () => ({
  type: REFRESH_GROUPS,
});