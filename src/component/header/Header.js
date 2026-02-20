import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../img/header_logo.png';
import './header.css';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN_ACTION_TYPE } from '../../store.js';
import apiConfig from '../../config/apiConfig.js';

const MOBILE_BREAKPOINT = 768;

const Header = () => {
  const login = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isShrink, setIsShrink] = useState(false);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerNav = [
    { text: 'Home', path: '/' },
    { text: 'Movie', path: '/movies/catalog' },
  ];

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
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  const handleScrollAndResize = () => {
    const shrink = window.scrollY > 100;
    const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const collapsed = mobile && shrink;

    setIsShrink(shrink);
    setIsMobileCollapsed(collapsed);

    if (!collapsed) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    handleScrollAndResize();
    window.addEventListener('scroll', handleScrollAndResize);
    window.addEventListener('resize', handleScrollAndResize);

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`header ${isShrink ? 'header--shrink' : ''} ${
        isMobileCollapsed ? 'header--mobile-collapsed' : ''
      }`}
    >
      <div
        className="header__logo"
        onClick={() => {
          navigate('/');
          closeMenu();
        }}
      >
        <img src={logo} className="header__logo__img" alt="" />
      </div>

      <button
        type="button"
        className="header__mobile-toggle"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? '\u2715' : '\u2630'}
      </button>

      <ul
        className={`header__items ${
          isMobileCollapsed ? 'header__items--mobile' : ''
        } ${isMenuOpen ? 'is-open' : ''}`}
      >
        {headerNav.map((item, index) => (
          <li className="header__itmes__li" key={index}>
            <Link to={item.path} onClick={closeMenu}>
              {item.text}
            </Link>
          </li>
        ))}

        {login ? (
          <li className="header__itmes__li">
            <Link to={'/members/mypage'} onClick={closeMenu}>
              My
            </Link>
          </li>
        ) : null}

        <li className="header__itmes__li">
          {!login ? (
            <Link to={'/loginForm'} onClick={closeMenu}>
              Login
            </Link>
          ) : (
            <button onClick={logoutHandle}>LogOut</button>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
