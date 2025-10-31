import React, { useEffect, useRef, useState } from 'react';
import './TrailerModal.css';
import { category, videoType } from '../../config/guckflixApi';
import axiosCustom from '../../config/axiosCustom';
import apiConfig from '../../config/apiConfig';
import guckflixApi from '../../config/guckflixApi';

const TrailerModal = ({ item }) => {
  const iframeRef = useRef();
  const [iframeSrc, setIframeSrc] = useState();
  useEffect(() => {
    const getVideo = async () => {
      const response = await guckflixApi.getVideos(category.movies, item.id);
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

      iframeRef.current.src = apiConfig.youtubeUrl + youtubeUrlKey[0].key;
      setIframeSrc(iframeRef.current.src);
    };
    getVideo();
  }, []);

  const modalRef = useRef();

  return (
    <div className={`modal none`} id={`${item.id}`} ref={modalRef}>
      <div
        onClick={() => {
          // 다른 곳을 클릭할 경우 꺼짐
          modalRef.current.classList.add('none');
          iframeRef.current.src = '';
          iframeRef.current.src = iframeSrc;
        }}
      >
        <iframe
          ref={iframeRef}
          src=""
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
