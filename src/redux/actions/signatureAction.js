import { SAVE_SIGNATURE } from "../actionTypes";

export const saveSignature = (signature) => ({
    type: SAVE_SIGNATURE,
    payload: signature,
});