import axios from "axios";
import { toBearerAuth } from '../header';
import { STORAGE_KEY } from "../../constants";

const getHeaders = (token = '') => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      return {
        ...defaultHeaders,
        Authorization: toBearerAuth(token),
      };
    }
  
    return defaultHeaders;
};
  
  axios.defaults.baseURL = process.env.VUE_APP_SAUNA_URL;
  axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent -> set Authorization header from header
    let token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    if(token) {
      config.headers = getHeaders(token);
    } else {
      config.headers = getHeaders();
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // transform from response.data of axios to response data from api
    return response.data;
  },
  (error) => {
    let response = error?.response || null;
    
    if(error.code === "ERR_NETWORK") {
      window.location.href = '/admin/error/offline';
    }

    if (response) {
      if (response.status === 401) {
        window.location.href = '/admin/error/401';
      }

      if (response.status === 500) {
        window.location.href = '/admin/error/500';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;