import React from 'react';
import { MoonLoader } from 'react-spinners';
import './loading.css';

const Loading = () => {
  return (
    <div className="container">
      <div className="loading">
        <MoonLoader color="#36d7b7" />
      </div>
    </div>
  );
};

export default Loading;
