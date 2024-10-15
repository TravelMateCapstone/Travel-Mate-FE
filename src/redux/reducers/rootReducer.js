import { combineReducers } from 'redux';
import couterReducer from './couterReducer';
import modalReducer from './modalReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    couter: couterReducer,
    auth: authReducer,
    modal: modalReducer,
});

export default rootReducer;
