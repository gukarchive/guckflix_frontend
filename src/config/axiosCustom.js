import axios from 'axios';
import apiConfig from './apiConfig';
import queryString from 'query-string';

const axiosJson = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-type': 'application/json',
  },
  paramsSerializer: (params) =>
    queryString.stringify({
      ...params,
    }),
});

export const axiosMultipart = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  paramsSerializer: (params) =>
    queryString.stringify({
      ...params,
    }),
});

export default axiosJson;
