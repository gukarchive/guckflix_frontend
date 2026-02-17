import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../img/header_logo.png';
import './header.css';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN_ACTION_TYPE } from '../../store.js';
import apiConfig from '../../config/apiConfig.js';

const Header = () => {
  const login = useSelector((state) => state.login);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // logout
  const logoutHandle = async () => {
    const promise = await fetch(`${apiConfig.baseUrl}/members/logout`, {
      method: 'POST',
      headers: {},
      credentials: 'include',
    });

    const response = await promise.json();

    if (response.status_code === 200) {
      dispatch({ type: LOGIN_ACTION_TYPE.SET_ID, payload: null });
      dispatch({ type: LOGIN_ACTION_TYPE.SET_LOGIN, payload: false });
      dispatch({ type: LOGIN_ACTION_TYPE.SET_ROLE, payload: null });
      navigate('/');
    }
  };

  const role = useSelector((state) => state.role);

  // Nav
  const headerNav = [
    { text: 'Home', path: '/' },
    { text: 'Movie', path: '/movies/catalog' },
  ];
  const nav = useNavigate();

  // 헤더 축소 애니메이션
  const header = useRef(null);

  const defaultHeaderStyle = {
    zIndex: '100',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: '0.5fr 2fr',
    alignItems: 'center',
    position: 'fixed',
    width: '100vw',
    opacity: '1',
    height: '100px',
    transition: '0.2s ease',
    background: 'none'
  };

  const shrinkHeaderStyle = {
    backgroundColor: 'black',
    height: '50px',
    opacity: '0.8',
    transition: '0.7s ease',
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      Object.assign(header.current.style, shrinkHeaderStyle);
    } else {
      Object.assign(header.current.style, defaultHeaderStyle);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={defaultHeaderStyle} ref={header}>
      <div
        className="header__logo"
        onClick={() => {
          nav('/');
        }}
      >
        <img src={logo} className="header__logo__img" alt="" />
      </div>
      <ul className="header__items">
        {/* {role === 'ADMIN' ? (
          <li className="header__itmes__li">
            <Link to={'/admin/movies'}>Admin</Link>
          </li>
        ) : (
          <></>
        )} */}
        {headerNav.map((e, i) => {
          return (
            <li className="header__itmes__li" key={i}>
              <Link to={e.path}>{e.text}</Link>
            </li>
          );
        })}
        {login ? (
          <li className="header__itmes__li">
            <Link to={'/members/mypage'}>My</Link>
          </li>
        ) : (
          <></>
        )}
        <li className="header__itmes__li">
          {!login ? (
            <Link to={'/loginForm'}>{'Login'}</Link>
          ) : (
            <button onClick={logoutHandle}>LogOut</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Header;
