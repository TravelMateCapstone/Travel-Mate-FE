import { SEARCH } from "../actionTypes";

export const search = (searchKey) => ({
    type: SEARCH,
    payload: searchKey,
});
