import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../component/loading/Loading';
import { sessionCheck } from '../../LoginChecker';

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const isValid = await sessionCheck(dispatch);
      if (!isMounted) {
        return;
      }

      if (!isValid) {
        navigate('/loginForm', { replace: true });
        return;
      }

      const savedPath = localStorage.getItem('requestedApi');
      const requestedApi = savedPath && savedPath.startsWith('/') ? savedPath : '/';

      localStorage.removeItem('requestedApi');
      navigate(requestedApi, { replace: true });
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  return <Loading />;
};

export default AuthCallback;
