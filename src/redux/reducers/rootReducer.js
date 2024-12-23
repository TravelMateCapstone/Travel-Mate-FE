import { combineReducers } from 'redux';
import couterReducer from './couterReducer';
import modalReducer from './modalReducer';
import authReducer from './authReducer';
import groupReducer from './groupReducer';
import eventReducer from './eventReducer';
import profileReducer from './profileReducer';
import requestReducer from './requestReducer';
import messageReducer from './messageReducer';
import chatReducer from './chatReducer';
import tourReducer from './tourReducer';
import searchReducer from './searchReducer';
import signatureReducer from './signatureReducer';
import chatHubReducer from './chatHubReducer';

const rootReducer = combineReducers({
    couter: couterReducer,
    auth: authReducer,
    modal: modalReducer,
    group: groupReducer,
    event: eventReducer,
    profile: profileReducer,
    request: requestReducer,
    message: messageReducer,
    chat: chatReducer,
    tour: tourReducer,
    search: searchReducer,
    signature: signatureReducer,
    chatHub: chatHubReducer,
});

export default rootReducer;
