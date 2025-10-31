import React from 'react';
import HeroSlide from '../component/heroSlide/HeroSlide.jsx';
import VideoSlider from '../component/videoSlider/VideoSlider.js';
import {
  category,
  sortingType,
  VideoSliderActionType,
} from '../config/guckflixApi.js';

const Home = () => {
  const showList = [
    {
      category: category.movies,
      type: sortingType.top_rated,
      text: '최고 평점 명화',
    },
    {
      category: category.movies,
      type: sortingType.popular,
      text: '최고 인기 영화',
    },
    // {
    //   category: category.tv,
    //   type: sortingType.popular,
    //   text: '최고 인기 시리즈',
    // },
    // {
    //   category: category.tv,
    //   type: sortingType.top_rated,
    //   text: '명작 시리즈',
    // },
  ];
  const action = VideoSliderActionType.main;
  return (
    <div>
      <HeroSlide />
      <VideoSlider showList={showList} action={action} buttonNeed={true} />
    </div>
  );
};

export default Home;
