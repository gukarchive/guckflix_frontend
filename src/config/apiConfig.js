const apiConfig = {
  language: 'ko',
  baseUrl: process.env.REACT_APP_API_URL,
  // 원본 크기 이미지와 썸네일 이미지
  youtubeUrl: ' https://www.youtube.com/embed/',
  originalImage: (imgPath) =>
    imgPath !== null && imgPath !== undefined && imgPath !== 'undefined'
      ? apiConfig.baseUrl + `/images/original/${imgPath}`
      : null,
  w500Image: (imgPath) =>
    imgPath !== null && imgPath !== undefined && imgPath !== 'undefined'
      ? apiConfig.baseUrl + `/images/w500/${imgPath}`
      : null,
  profileImage: (imgPath) =>
    imgPath !== null && imgPath !== undefined && imgPath !== 'undefined'
      ? apiConfig.baseUrl + `/images/profile/${imgPath}`
      : null,
};

export default apiConfig;
