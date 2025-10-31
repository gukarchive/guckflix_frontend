import React, { useEffect, useRef, useState } from 'react';
import { VideoCard } from '../../component/videoSlider/VideoSlider';
import apiConfig from '../../config/apiConfig';
import guckflixApi, {
  category,
  sortingType,
  VideoSliderActionType,
} from '../../config/guckflixApi';
import './catalog.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HoverbleClickableBtn } from '../../component/historyCatalog/HistoryCatalog';

const Catalog = () => {

  // 렌더링 확인 변수
  const isInitialRender = useRef(true);

  const [videos, setVideos] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    isQuery: false,
    keyword: ''
  });
  const [hasNext, setHasNext] = useState(false);

  let arr = [];

  // 최초 실행
  useEffect(()=> {
    getPopularVideo(params.page);
    isInitialRender.current = false;
  }, [])

  // 검색어 입력 시 디바운스 적용하여 0.3초가 지난 이후 쿼리
  useEffect(()=> {
    if(!isInitialRender.current && params.keyword != ''){
      const timeoutId = setTimeout(()=> getSearchVideo(params.page, params.keyword), 300);
      return () => {
        clearTimeout(timeoutId);
      }
    } else if (!isInitialRender.current && params.keyword == '') {
      getPopularVideo(1);
    }
  }, [params.keyword])

  // 다음 페이지 버튼 클릭 시
  useEffect(()=> {
    if(params.isQuery) { // 검색중이면 검색 결과 다음 페이지
      getSearchVideo(params.page, params.keyword);
    } else if(!params.isQuery) { // 검색중이 아니면 유명한 영화 다음 페이지
      getPopularVideo(params.page);
    }
  }, [params.page])

  const getPopularVideo = async (page) => {
    let response;
    guckflixApi
          .getList(category.movies, sortingType.popular, {
            params: {
              page: page,
            },
          })
          .then((data) => {
            response = data;
            setHasNext(true);
            setPosters(response);
          })
          .catch((err) => console.log(err));
  }

  const getSearchVideo = async (page, keyword) => {
    let response;
    guckflixApi
      .getSearchResult(category.movies, {
        params: {
          page: page,
          keyword: keyword,
        },
      })
      .then((data) => {
        response = data;
        setPosters(response);
        setHasNext(response.data.hasNext);
      })
      .catch((err) => console.log(err));
    }

    const setPosters = (response) => {
      response.data.results.forEach((e) => {
        let vo = {
          category: category.movies,
          name: e.title,
          url: apiConfig.w500Image(e.poster_path),
          id: e.id,
        };
        arr.push(vo);
      });
      setVideos([...videos, ...arr]);
      arr = [];
    };

  const changeHandle = (e) => {

    let isQuery;
    if(e.target.value.length != 0) {
      isQuery = true;
    } else {
      isQuery = false;
    }

    setParams({ ...params, page: 1, isQuery: isQuery, keyword: e.target.value });
    setVideos([]);
  };

  const action = VideoSliderActionType.catalog;
  const text = {
    catalog: '카탈로그',
    search: '제목을 입력하세요',
    loadMore: '더 찾기',
  };

  const navigate = useNavigate();

  const formHandle = () => {
    navigate(`/movies/form`);
  };

  const role = useSelector((state) => state.role);

  return (
    <div className="catalog">
      <div className="catalog__search">
        <input
          value={params.keyword}
          onChange={changeHandle}
          type="text"
          placeholder={`${text.search}`}
        />
        {role === 'ADMIN' ? (
          <HoverbleClickableBtn
            btnName={'등록'}
            className={'actorDetail__showingBtn'}
            func={formHandle}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="catalog__videos__wrap">
        <div>
          <div className="catalog__videos">
            {videos.map((e, i) => (
              <VideoCard data={e} key={i} action={action} />
            ))}
          </div>
        </div>
      </div>
      <div className="catalog__loadMore">
        {hasNext ? (
          <button
            className="catalog__loadMore__button"
            onClick={() => {
              setParams({ ...params, page: params.page + 1 });
            }}
          >
            {text.loadMore}
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Catalog;
