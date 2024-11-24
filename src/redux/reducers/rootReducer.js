import { combineReducers } from 'redux';
import couterReducer from './couterReducer';
import modalReducer from './modalReducer';
import authReducer from './authReducer';
import groupReducer from './groupReducer';
import eventReducer from './eventReducer';
import profileReducer from './profileReducer';
import requestReducer from './requestReducer';
import messageReducer from './messageReducer';

const rootReducer = combineReducers({
    couter: couterReducer,
    auth: authReducer,
    modal: modalReducer,
    group: groupReducer,
    event: eventReducer,
    profile: profileReducer,
    request: requestReducer,
    message: messageReducer,
    
});

export default rootReducer;
