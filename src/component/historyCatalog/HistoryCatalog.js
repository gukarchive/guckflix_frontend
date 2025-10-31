import React, { useEffect, useState } from 'react';
import './historyCatalog.css';
import { useNavigate } from 'react-router-dom';

const HistoryCatalog = ({ catalogItems }) => {
  useEffect(() => {
    console.log(catalogItems);
  }, [catalogItems]);

  return (
    <div className="historyCatalog__OutlineBox">
      {Object.keys(catalogItems).length > 0 &&
        Object.keys(catalogItems).map((year) => {
          return (
            <div key={year} className="historyCatalog__year">
              <h3>{year}</h3>
              <div>
                {catalogItems[year].map((item) => (
                  <div key={item.movie_id} className="historyCatalog__title">
                    <HoverbleClickableTitle
                      title={item.title}
                      navigateURL={`/movies/${item.movie_id}`}
                    />
                    <div className="historyCatalog__casting">
                      {item.character}&nbsp;역
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export const HoverbleClickableBtn = ({ btnName, func, className }) => {
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const style = {
    transform: hover ? 'scale(1)' : 'scale(0.95)',
    color: hover ? 'red' : 'cornflowerblue',
    cursor: hover ? 'pointer' : 'revert',
    transition: '0.2s ease',
    display: 'inline-block',
  };
  return (
    <button
      className={className}
      style={style}
      onClick={func}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {btnName}
    </button>
  );
};

const HoverbleClickableTitle = ({ title, navigateURL }) => {
  const navigate = useNavigate();

  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const style = {
    transform: hover ? 'scale(1)' : 'scale(0.95)',
    color: hover ? 'red' : 'white',
    cursor: hover ? 'pointer' : 'revert',
    transition: '0.2s ease',
    display: 'inline-block',
  };
  return (
    <div
      onClick={() => navigate(navigateURL)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      {title}
    </div>
  );
};

export default HistoryCatalog;
