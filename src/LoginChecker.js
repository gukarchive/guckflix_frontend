import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LOGIN_ACTION_TYPE } from './store';
import { useLocation } from 'react-router-dom';
import apiConfig from './config/apiConfig';
const LoginChecker = () => {
  // 세션 체크 + 연장
  const dispatch = useDispatch();

  const sessionCheck = async () => {
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
  };

  // URL 변경 시 실행
  const location = useLocation();

  useEffect(() => {
    // 최초 실행 + 25분마다 세션 갱신 실행
    let sessionInterval = null;
    if (sessionCheck()) {
      sessionInterval = setInterval(sessionCheck, 25 * 60 * 1000);
    }
    return () => {
      clearInterval(sessionInterval);
    };
  }, [location.pathname]);

  return <></>;
};

export default LoginChecker;
