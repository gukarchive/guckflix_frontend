import React from 'react';
import Header from './component/header/Header';

const PublicRoute = ({ element }) => {
  return (
    <>
      <Header />
      {element}
    </>
  );
};

export default PublicRoute;
