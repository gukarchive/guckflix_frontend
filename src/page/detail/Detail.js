import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import VideoSlider from '../../component/videoSlider/VideoSlider';
import apiConfig from '../../config/apiConfig';
import axiosCustom from '../../config/axiosCustom';
import guckflixApi, {
  VideoSliderActionType,
  videoType,
} from '../../config/guckflixApi';
import './detail.css';

const Detail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState([]);
  const [iframeSrc, setIframeSrc] = useState();
  const category = 'movies';

  useEffect(() => {
    const getDetail = async () => {
      const params = {};
      const response = await guckflixApi.getDetail(category, id, { params });
      setDetail(response.data);
    };

    const getVideo = async () => {
      const response = await guckflixApi.getVideos(category, id);

      let youtubeUrlKey;

      // 관련 비디오가 많은 경우 트레일러만 가져오겠다
      if (response.data.results.length !== 0) {
        youtubeUrlKey = response.data.results.filter((e) => {
          return e.type === videoType.trailer;
        });
      }

      // 만약 기본값(한국어)로 요청한 데이터가 없으면 영어로 재요청
      if (response.data.results.length === 0) {
        const temporaryHeaders = {
          'Content-type': 'application/json',
          'Accept-Language': 'en-US', // 임시로 변경할 언어 헤더
        };
        const retryResponse = await axiosCustom.get(
          response.request.responseURL,
          {
            headers: temporaryHeaders,
            params: {},
          },
        );
        youtubeUrlKey = retryResponse.data.results.filter((e) => {
          return e.type === videoType.trailer;
        });
      }

      //없다면 트레일러가 아닌 영상이라도 삽입
      setIframeSrc(
        youtubeUrlKey.length !== 0
          ? apiConfig.youtubeUrl + youtubeUrlKey[0].key
          : apiConfig.youtubeUrl + response.data.results[0].key,
      );
    };

    getDetail();
    getVideo();
  }, [id]);

  const showList = [
    [
      {
        category: category,
        text: '배역',
      },
    ],
    [
      {
        category: category,
        text: '유사한 작품',
      },
    ],
  ];

  const similar = VideoSliderActionType.similar;
  const credit = VideoSliderActionType.credit;
  const backgroundImageURL = apiConfig.originalImage(detail.backdrop_path);
  const posterImageURL = apiConfig.w500Image(detail.poster_path);

  return (
    <div className="detail">
      <div
        className="detail__tops"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)),' +
            `url(${backgroundImageURL})`,
        }}
      >
        <div className="detail__tops__title">
          {detail.title ? detail.title : detail.name}
        </div>
        <div className="detail__tops__sub">
          {detail.release_date && (
            <div className="detail__tops__sub__relDate">
              {detail.release_date.substr(0, 4)}
            </div>
          )}
          {detail.runtime && (
            <div className="detail__tops__sub__runtime">{detail.runtime}M</div>
          )}
          <div className="detail__tops__sub__runtime__genre">
            {detail.genres &&
              detail.genres.map((e, i) => {
                return (
                  <div className="detail__tops__sub__genre__item" key={i}>
                    {e.genre}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="detail__tops__posterSection">
          <img
            src={`${posterImageURL}`}
            className="detail__tops__posterSection__img"
            alt=""
          />
          <Iframe src={iframeSrc} title={id} key={`iframe out${id}`} />
        </div>
        {detail.tagline && (
          <div className="detail__tops__tagline">{detail.tagline}</div>
        )}
      </div>
      <div className="detail__bottoms">
        <div className="detail__bottoms__overview">
          <div className="detail__bottoms__overview__title">개요</div>

          <div className="detail__bottoms__overview__text">
            {detail.overview}
          </div>
        </div>
        <div className="detail__bottoms__casts">
          <VideoSlider
            showList={showList[0]}
            action={credit}
            category={'movies'}
            buttonNeed={true}
          />
        </div>
        <div className="detail__bottoms__similars">
          <VideoSlider
            showList={showList[1]}
            action={similar}
            category={'movies'}
            buttonNeed={true}
          />
        </div>
      </div>
    </div>
  );
};

const Iframe = ({ src, id }) => {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <iframe
      className="detail__tops__posterSection__trailer"
      src={src}
      title={id}
      key={`iframe inn${id}`}
    />
  );
};
export default Detail;
