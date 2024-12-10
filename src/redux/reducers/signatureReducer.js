import { SAVE_SIGNATURE } from "../actionTypes";

const initialState = {
    signature: null,
};

const signatureReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_SIGNATURE:
            return {
                ...state,
                signature: action.payload,
            };
        default:
            return state;
    }
};

export default signatureReducer;