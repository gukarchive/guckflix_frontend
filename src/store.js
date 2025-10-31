const initialState = {
  id: '',
  login: null,
  role: null,
};

export const LOGIN_ACTION_TYPE = {
  SET_ID: 'SET_ID',
  SET_LOGIN: 'SET_LOGIN',
  SET_ROLE: 'SET_ROLE',
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_ACTION_TYPE.SET_ID:
      return {
        ...state,
        id: action.payload,
      };
    case LOGIN_ACTION_TYPE.SET_LOGIN:
      return {
        ...state,
        login: action.payload,
      };
    case LOGIN_ACTION_TYPE.SET_ROLE:
      return {
        ...state,
        role: action.payload,
      };
    default:
      return state; // 아무 작업도 하지 않고 현재 상태 반환
  }
};
