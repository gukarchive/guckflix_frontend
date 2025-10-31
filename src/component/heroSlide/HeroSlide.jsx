import React, { useEffect, useRef, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import tmdbApi, { category, sortingType } from '../../config/guckflixApi';
import TrailerModal from '../modal/TrailerModal';
import './heroSlide.css';
import { mouseUpAction, mouseDownAction } from './heroSlider';
import { useNavigate } from 'react-router-dom';

const HeroSlideItems = ({ item }) => {
  const string = {
    en: {
      watchTrailer: 'Watch Trailer',
      moreInfo: 'More Info',
    },
    ko: {
      watchTrailer: '트레일러 재생',
      moreInfo: '상세',
    },
  };

  const navigate = useNavigate();

  const backgroundImageURL = apiConfig.originalImage(item.backdrop_path);
  const posterImageURL = apiConfig.w500Image(item.poster_path);

  return (
    <div
      className="heroSlide__items"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)),' +
          `url(${backgroundImageURL})`,
      }}
    >
      <div className="heroSlide__items__content">
        <div className="heroSlide__items__content__info">
          <div className="heroSlide__items__content__info__title">
            {item.title}
          </div>
          <div className="heroSlide__items__content__info__overview">
            {item.overview}
          </div>
          <div className="heroSlide__items__content__info__buttonDiv">
            <button
              className="heroSlide__items__content__info__buttonDiv__button"
              onClick={() => {
                const id = document.getElementById(`${item.id}`);
                id.classList.remove('none');
              }}
            >
              <span className="material-symbols-outlined">play_circle</span>
              {string.ko.watchTrailer}
            </button>
            <button
              className="heroSlide__items__content__info__buttonDiv__button"
              onClick={() => {
                navigate(`/movies/${item.id}`);
              }}
            >
              <span className="material-symbols-outlined">info</span>
              {string.ko.moreInfo}
            </button>
          </div>
        </div>
        <img
          className="heroSlide__items__content__w500img"
          src={`${posterImageURL}`}
          alt=""
        />
      </div>
      <TrailerModal key={item.id} item={item} />
    </div>
  );
};

const HeroSlide = () => {
  // 데이터 가져오기
  const [movieItems, setMovieItems] = useState([]);
  useEffect(() => {
    const getList = async () => {
      const params = {};
      const response = await tmdbApi.getList(
        category.movies,
        sortingType.popular,
        {
          params,
        },
      );
      setMovieItems(response.data.results.slice(0, 10));
    };
    getList();
  }, []);

  const heroSlideRef = useRef();
  // 마우스 액션
  useEffect(() => {
    if (heroSlideRef) {
      heroSlideRef.current.addEventListener('mouseup', (e) => mouseUpAction(e));
      heroSlideRef.current.addEventListener('mousedown', (e) =>
        mouseDownAction(e),
      );
    }
    console.log('메인');
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        className="heroSlide"
        style={{ width: `${movieItems.length}` * 100 + 'vw' }}
        ref={heroSlideRef}
      >
        {movieItems.map((e, i) => {
          return <HeroSlideItems item={e} key={i} />;
        })}
      </div>
    </div>
  );
};

export default HeroSlide;
