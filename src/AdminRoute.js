import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from './component/loading/Loading';
import AdminTemplate from './component/admin/AdminTemplate.js';

const AdminRoute = ({ element }) => {
  const login = useSelector((state) => state.login);
  const role = useSelector((state) => state.role);
  const location = useLocation();

  // 주소 창 타고 들어올 경우 로그인 처리 결과가 로드될 때까지 로딩 스피너
  if (login === null) {
    return <Loading />;
  }

  // 관리자인 경우
  if(login && role == 'ADMIN'){
    return <AdminTemplate element={element} />
  }
  
  // 로그인이 필요한 경우 현재 요청한 위치 저장
  
  const requestedPath = location.pathname;
  return <Navigate to="/loginForm"
  state={{ from: requestedPath }}
  replace
  {...alert(`관리자 권한이 필요한 서비스입니다`)} />
};

export default AdminRoute;
