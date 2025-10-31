import React, { useEffect, useState } from 'react';
import AdminNavigator from './AdminNavigator';
import { Link } from 'react-router-dom';
import Header from '../header/Header';

const AdminTemplate = ({ element }) => {
  const container = {
    // display: 'grid',
    height: '100vh',
    width: '100vw',
    background: 'black',
    color: 'white',
    gridTemplateColumns: '13vw auto',
    gridTemplateAreas: '"left center-top" "left center-bottom"',
    gridTemplateRows: '8vh auto',
  };

  const gridCenterTop = {
    gridArea: 'center-top',
    textAlign: 'end',
    padding: '20px',
    boxSizing: 'border-box',
    alignSelf: 'center',
  };

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
  };

  return (
    <>
      <div style={container}>
      <Header />
        {/* <AdminNavigator /> */}
        {/* <div style={gridCenterTop}> */}
          {/* <Link to="/" style={linkStyle}>
            메인으로 돌아가기
          </Link> */}
        {/* </div> */}
        {element}
        <></>
      </div>
    </>
  );
};

export default AdminTemplate;
