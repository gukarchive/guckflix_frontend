import React, { useState } from 'react';
import './loginForm.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ACTION_TYPE } from '../../store.js';
import apiConfig from '../../config/apiConfig';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleIdChange = (event) => setId(event.target.value);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const basicLogin = async () => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/members/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: 'username=' + id + '&password=' + password,
      });

      const data = await response.json();

      if (data.status_code === 200) {
        navigate('/auth/callback');
      }

      if (data.status_code === 400) {
        dispatch({ type: LOGIN_ACTION_TYPE.SET_ID, payload: null });
        dispatch({ type: LOGIN_ACTION_TYPE.SET_LOGIN, payload: false });
        toast.error('아이디 또는 비밀번호를 확인해 주세요.');
      }
    } catch (error) {
      toast.error('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  const handleLogin = () => {
    window.location.href = `${apiConfig.baseUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="loginForm loginForm--signin">
      <h1>로그인</h1>
      <form
        onSubmit={submitHandler}
        onKeyDown={(e) => {
          if (e.keyCode === 13) basicLogin();
        }}
      >
        <div>
          <input
            type="text"
            value={id}
            onChange={handleIdChange}
            id="id"
            placeholder="아이디"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            id="password"
            placeholder="비밀번호"
          />
        </div>
      </form>

      <div className="loginForm__actions">
        <button className="loginForm__btn" onClick={basicLogin}>
          로그인
        </button>
        <button
          className="loginForm__btn loginForm__btn--light"
          onClick={() => navigate('/signUpForm')}
        >
          회원가입
        </button>
        <button className="loginForm__btn loginForm__btn--google" onClick={handleLogin}>
          구글로 연결
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
