import {
  AUTH_USER,
  DEAUTH_USER,
  AUTH_ERROR,
  AUTH_ERROR_RESET
} from './../actions/types';

const INITIAL_STATE =  {};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case AUTH_USER:
      return {...state, error: '', authenticated: true};
    case DEAUTH_USER:
      return {...state, error: '', authenticated: false};
    case AUTH_ERROR:
      return {...state, error: action.payload}
    case AUTH_ERROR_RESET:
      return {...state, error: ''};
    default:
      return state;
  }
}
