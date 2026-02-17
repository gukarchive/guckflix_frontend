import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './component/loading/Loading';
import Header from './component/header/Header';

const PrivateRoute = ({ element }) => {
  const login = useSelector((state) => state.login);
  const location = useLocation();

  if (login === null) {
    return <Loading />;
  }

  if (login) {
    return (
      <>
        <Header />
        {element}
      </>
    );
  }

  const requestedApi = location.pathname;
  localStorage.setItem('requestedApi', requestedApi);
  toast.warning('로그인이 필요합니다.', { toastId: 'login-required' });

  return <Navigate to="/loginForm" replace />;
};

export default PrivateRoute;
