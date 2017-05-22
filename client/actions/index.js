import {
  AUTH_USER,
  DEAUTH_USER,
  AUTH_ERROR,
  AUTH_ERROR_RESET
} from './types';

import {ValidateResponse, GetJson, GetToken} from './../utils/request';

export function registerUser({ email, password }, callback) {
  return function(dispatch) {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(ValidateResponse)
    .then(GetToken)
    .then(token => {
      // if request is good
      // - indicate the user is authenticated
      dispatch({
        type: AUTH_USER
      });
      // - save the JWT token
      localStorage.setItem('token', token);
      // - redirect to the expenses route
      if (!!callback) {
        callback();
      }
    })
    .catch(e => {
      // if request is bad
      // - show an error to the user
      dispatch(authError(e.message));
    })
  }
}


export function loginUser({ email, password }, callback) {
  return function(dispatch) {
    // Submit email/password to server
    fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(ValidateResponse)
    .then(GetToken)
    .then(token => {
      dispatch({
        type: AUTH_USER
      });
      localStorage.setItem('token', token);
      if (!!callback) {
        callback();
      }
    })
    .catch(e => {
      // if request is bad
      // - show an error to the user
      dispatch(authError('Incorrect login credentials'));
    });
  }
}


export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}


export function logoffUser() {
  // - get rid of the token
  localStorage.removeItem('token');
  // - reset authenticated to false
  return {
    type: DEAUTH_USER
  };
}


export function resetAuthError() {
  return {
    type: AUTH_ERROR_RESET
  };
}
