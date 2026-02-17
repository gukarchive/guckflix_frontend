import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LOGIN_ACTION_TYPE } from './store';
import { useLocation } from 'react-router-dom';
import apiConfig from './config/apiConfig';

export const sessionCheck = async (dispatch) => {
  const promise = await fetch(`${apiConfig.baseUrl}/session/validation`, {
    headers: {},
    credentials: 'include',
  });

  const response = await promise.json();

  if (response.status_code === 200) {
    dispatch({ type: LOGIN_ACTION_TYPE.SET_ID, payload: response.data.id });
    dispatch({ type: LOGIN_ACTION_TYPE.SET_LOGIN, payload: true });
    dispatch({
      type: LOGIN_ACTION_TYPE.SET_ROLE,
      payload: response.data.role,
    });
    return true;
  }

  if (response.status_code === 401) {
    dispatch({ type: LOGIN_ACTION_TYPE.SET_ID, payload: null });
    dispatch({ type: LOGIN_ACTION_TYPE.SET_LOGIN, payload: false });
    dispatch({ type: LOGIN_ACTION_TYPE.SET_ROLE, payload: null });
    return false;
  }

  return false;
};

const LoginChecker = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    let sessionInterval = null;

    const run = async () => {
      const isValid = await sessionCheck(dispatch);
      if (isValid) {
        sessionInterval = setInterval(() => sessionCheck(dispatch), 25 * 60 * 1000);
      }
    };

    run();

    return () => {
      clearInterval(sessionInterval);
    };
  }, [location.pathname, dispatch]);

  return <></>;
};

export default LoginChecker;
