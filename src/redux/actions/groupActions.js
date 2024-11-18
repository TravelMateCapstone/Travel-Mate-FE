import { VIEW_GROUP, REFRESH_GROUPS, UPDATE_GROUP } from "../actionTypes";

export const viewGroup = (group, userJoinedStatus) => ({
  type: VIEW_GROUP,
  payload: { group, userJoinedStatus },
});

export const refreshGroups = () => ({
  type: REFRESH_GROUPS,
});

export const updateGroup = (updatedGroup) => ({
  type: UPDATE_GROUP,
  payload: { updatedGroup },
});