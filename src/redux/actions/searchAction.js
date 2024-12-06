import { SEARCH_TOUR } from "../actionTypes";

export const searchTour = (searchKey) => ({
    type: SEARCH_TOUR,
    payload: searchKey,
});
