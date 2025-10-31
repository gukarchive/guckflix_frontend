import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import guckflixApi from '../../config/guckflixApi';
import './loginForm.css';

const STATUS = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  ADVICE: 'ADVICE',
};

const MESSAGES = {
  USERNAME: '아이디 : 4 ~ 20 자리의 영문과 숫자',
  PASSWORD: '비밀번호 : 8 ~ 20 자리의 최소 하나의 영 대소문자와 숫자',
  EMAIL: '이메일 : 이메일 형식',
  AVALIABLE: '사용 가능한 아이디입니다',
  DUPLICATED: '중복된 아이디입니다',
};

const SignUpForm = () => {
  const [form, setForm] = useState({
    password: '',
    username: '',
    email: '',
  });

  const [usernameProps, setUsernameProps] = useState({
    message: MESSAGES.USERNAME,
    status: STATUS.ADVICE,
  });

  const [passwordProps, setPasswordProps] = useState({
    message: MESSAGES.PASSWORD,
    status: STATUS.ADVICE,
  });

  const [emailProps, setEmailProps] = useState({
    message: MESSAGES.EMAIL,
    status: STATUS.ADVICE,
  });

  const handleUsernameChange = async (event) => {
    setForm({ ...form, username: event.target.value });

    // 4 ~ 20 자의 영문과 숫자만 허용. 영문자 필수
    var reg = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,20}$/;

    // 입력값이 있어서 정규식을 검사하는 경우
    if (event.target.value !== '' && reg.test(event.target.value)) {
      // 정규식을 성공하면 ID 검사
      const response = await guckflixApi.getUsernameCheck({
        username: event.target.value,
      });

      if (response.status === 200) {
        // ID 검증도 성공하면 녹색 글씨
        setUsernameProps({
          message: MESSAGES.AVALIABLE,
          status: STATUS.SUCCESS,
        });
      }
      if (response.status === 409) {
        // ID가 중복되면 붉은 글씨
        setUsernameProps({
          message: MESSAGES.DUPLICATED,
          status: STATUS.FAIL,
        });
      }
    } else {
      // 정규식을 실패하면 붉은 글씨
      setUsernameProps({
        message: MESSAGES.USERNAME,
        status: STATUS.FAIL,
      });
      console.log('실패');
    }

    // 입력값이 공백이면 ADVICE (흰글씨 상태)
    if (event.target.value === '') {
      setUsernameProps({
        message: MESSAGES.USERNAME,
        status: STATUS.ADVICE,
      });
    }
  };

  const handlePasswordChange = (event) => {
    setForm({ ...form, password: event.target.value });

    // 8 ~ 20자의 영 소문자, 영 대문자, 숫자를 각각 1개 이상 포함 필수
    var reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,20}$/;

    // 입력값이 있어서 정규식을 검사하는 경우
    if (event.target.value !== '' && reg.test(event.target.value)) {
      // 성공하면 녹색 글씨
      setPasswordProps({
        ...passwordProps,
        status: STATUS.SUCCESS,
      });
    } else {
      // 실패하면 붉은 글씨
      setPasswordProps({
        ...passwordProps,
        status: STATUS.FAIL,
      });
    }

    // 입력값이 공백이면 ADVICE (흰글씨 상태)
    if (event.target.value === '') {
      setPasswordProps({
        ...passwordProps,
        status: STATUS.ADVICE,
      });
    }
  };

  const handleEmailChange = (event) => {
    setForm({ ...form, email: event.target.value });

    /**
     * 이메일 정규식은 다음과 같이 지원
     * univ.user1@gmail.com
     * user251930@naver.com
     * guck@hahaha.co.kr
     * univ.user1@gmail.co.kr
     * hello-guck@daum.co.kr
     */

    var reg =
      /^[a-zA-z0-9]+([._\-][0-9a-zA-Z]+)?@[a-zA-Z0-9]+\.[a-zA-Z0-9]+(\.[a-z0-9A-z]+)?$/;
    // 입력값이 있어서 정규식을 검사하는 경우
    if (event.target.value !== '' && reg.test(event.target.value)) {
      // 성공하면 녹색 글씨
      setEmailProps({
        ...emailProps,
        status: STATUS.SUCCESS,
      });
    } else {
      // 실패하면 붉은 글씨
      setEmailProps({
        ...emailProps,
        status: STATUS.FAIL,
      });
    }

    // 입력값이 공백이면 ADVICE (흰글씨 상태)
    if (event.target.value === '') {
      setEmailProps({
        ...emailProps,
        status: STATUS.ADVICE,
      });
    }
  };

  const navigate = useNavigate();

  const formHandle = async () => {
    if (usernameProps.status !== STATUS.AVALIABLE) {
      alert('이름을 다시 입력하세요.');
      return;
    }
    if (passwordProps.status !== STATUS.SUCCESS) {
      alert('패스워드를 다시 입력하세요.');
      return;
    }
    if (emailProps.status !== STATUS.SUCCESS) {
      alert('이메일을 다시 입력하세요.');
      return;
    }

    const response = await guckflixApi.postSignUp(form);

    if (response.status === 200) {
      alert('정상적으로 가입되었습니다. 다시 로그인해주세요.');
      navigate('/loginForm');
    }
    if (response.status === 400) {
      alert('잘못된 요청입니다.');
    }
    if (response.status === 405) {
      alert(
        '이미 가입된 사용자 입니다. 로그인하거나 다른 아이디로 가입하세요.',
      );
    }
    if (response.status === 500) {
      alert('서버에 오류가 있습니다. 다시 시도하거나 고객센터에 문의하세요.');
    }
  };

  return (
    <div className="loginForm">
      <h1>회원가입</h1>
      <form
        onKeyDown={(e) => {
          if (e.keyCode === 13) formHandle();
        }}
      >
        <div>
          <div>
            <HandlerComponent handleProps={usernameProps} />
          </div>
          <input
            type="text"
            value={form.username}
            onChange={handleUsernameChange}
            placeholder="아이디"
          />
        </div>
        <div>
          <div>
            <HandlerComponent handleProps={passwordProps} />
          </div>
          <input
            type="password"
            value={form.password}
            onChange={handlePasswordChange}
            placeholder="패스워드"
          />
        </div>
        <div>
          <div>
            <HandlerComponent handleProps={emailProps} />
          </div>
          <input
            type=""
            value={form.email}
            onChange={handleEmailChange}
            placeholder="이메일"
          />
        </div>
      </form>

      <div>
        <button onClick={formHandle}>가입</button>
        <hr></hr>
      </div>
    </div>
  );
};

const HandlerComponent = ({ handleProps }) => {
  const successStyle = {
    color: 'green',
  };

  const failStyle = {
    color: 'red',
  };

  if (handleProps.status === STATUS.ADVICE)
    return <div>{handleProps.message}</div>;

  if (handleProps.status === STATUS.SUCCESS)
    return <div style={successStyle}>{handleProps.message}</div>;

  if (handleProps.status === STATUS.FAIL)
    return <div style={failStyle}>{handleProps.message}</div>;
};

export default SignUpForm;
