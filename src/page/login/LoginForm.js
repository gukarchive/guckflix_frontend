import React, { useState } from 'react';
import './loginForm.css';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LOGIN_ACTION_TYPE } from '../../store.js';
import apiConfig from '../../config/apiConfig';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleIdChange = (event) => setId(event.target.value);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();

  // const basicSignUp = () => {
  //   fetch('http://localhost:8081/members', {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     method: 'POST',
  //     mode: 'cors', // CORS 요청 모드
  //     credentials: 'include', // 자격 증명 포함
  //     body: Object.entries()
  //       .map((e) => e.join('='))
  //       .join('&'),
  //   })
  //     .then((data) => data.json())
  //     .then((json) => console.log(json));
  // };

  const dispatch = useDispatch();

  const basicLogin = async () => {
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
      dispatch({ type: LOGIN_ACTION_TYPE.SET_ID, payload: data.id });
      dispatch({ type: LOGIN_ACTION_TYPE.SET_LOGIN, payload: true });
      dispatch({
        type: LOGIN_ACTION_TYPE.SET_ROLE,
        payload: data.role,
      });
      navigate('/');
    }
    if (data.status_code === 400) {
      dispatch({ type: LOGIN_ACTION_TYPE.SET_ID, payload: null });
      dispatch({ type: LOGIN_ACTION_TYPE.SET_LOGIN, payload: false });
    }
  };

  const location = useLocation(); // useLocation 훅으로 현재 위치 정보 가져오기
  const redirectPath = location.state?.from || '/'; // state가 없으면 기본값으로 '/' 사용

  const handleLogin = () => {
    window.location.href = `${apiConfig.baseUrl}/oauth2/authorization/google?state=${redirectPath}`;
  };


  return (
    <div className="loginForm">
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
            placeholder="패스워드"
          />
        </div>
      </form>
      <div>
        <button onClick={basicLogin}>로그인</button>
        <button onClick={() => navigate('/signUpForm')}>회원가입으로</button>
        <hr></hr>
        <button onClick={handleLogin}>구글로 연결</button>
      </div>
    </div>
  );
};

export default LoginForm;
