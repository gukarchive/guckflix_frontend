import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './component/loading/Loading';
import AdminTemplate from './component/admin/AdminTemplate.js';

const SKIP_REQUESTED_API_ONCE_KEY = 'skipRequestedApiOnce';

const AdminRoute = ({ element }) => {
  const login = useSelector((state) => state.login);
  const role = useSelector((state) => state.role);
  const location = useLocation();

  if (login === null) {
    return <Loading />;
  }

  if (login && role === 'ADMIN') {
    return <AdminTemplate element={element} />;
  }

  if (login && role === 'USER') {
    toast.warning('관리자 권한이 필요합니다.', { toastId: 'admin-required' });
    return <Navigate to="/" replace />;
  }

  const shouldSkipSaveRequestedApi =
    localStorage.getItem(SKIP_REQUESTED_API_ONCE_KEY) === 'true';

  if (shouldSkipSaveRequestedApi) {
    localStorage.removeItem(SKIP_REQUESTED_API_ONCE_KEY);
  } else {
    const requestedPath = location.pathname;
    localStorage.setItem('requestedApi', requestedPath);
  }

  toast.warning('관리자 로그인이 필요합니다.', { toastId: 'admin-login-required' });

  return <Navigate to="/loginForm" replace />;
};

export default AdminRoute;
