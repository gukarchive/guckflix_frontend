import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../img/header_logo.png';

const AdminNavigator = () => {
  const nav = useNavigate();

  const { pathname } = useLocation();

  const style = {
    gridArea: 'left',
    padding: '20px',
    background: '#020721',
    color: 'white',
    textAlign: 'center',
  };

  const menu = [
    // { text: '개요', nav: '/admin' },
    { text: '영화 관리', nav: '/admin/movies' },
    // { text: '배우 관리', nav: '/' },
    // { text: '회원 관리', nav: '/' },
    // { text: '사용자 통계', nav: '/' },
    // { text: '마케팅 동의 회원 SMS 발송', nav: '/' },
  ];

  const navContentStyle = {
    textAlign: 'left',
    paddingLeft: '20px',
  };

  const navSelectedStyle = {
    color: 'red',
    textAlign: 'left',
    paddingLeft: '20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
  };

  return (
    <div style={style}>
      <div
        onClick={() => {
          nav('/');
        }}
      >
        <img src={logo} style={{ height: '40px', objectFit: 'cover' }} alt="" />
      </div>
      <div style={{ borderBottom: '1px solid #252525' }}>
        <h3>관리자 대시보드</h3>
      </div>
      {menu.map((item) => (
        <>
          <div
            style={pathname === item.nav ? navSelectedStyle : navContentStyle}
          >
            <h4>
              <Link to={item.nav} style={linkStyle}>
                {item.text}
              </Link>
            </h4>
          </div>
        </>
      ))}
    </div>
  );
};

export default AdminNavigator;
