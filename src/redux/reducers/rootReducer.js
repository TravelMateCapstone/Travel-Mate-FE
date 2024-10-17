import { combineReducers } from 'redux';
import couterReducer from './couterReducer';
import modalReducer from './modalReducer';
import authReducer from './authReducer';
import groupReducer from './groupReducer';
import eventReducer from './eventReducer';

const rootReducer = combineReducers({
    couter: couterReducer,
    auth: authReducer,
    modal: modalReducer,
    group: groupReducer,
    event: eventReducer
});

export default rootReducer;
