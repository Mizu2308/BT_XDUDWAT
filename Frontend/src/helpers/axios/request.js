import axios from "axios";
import { STORAGE_KEY } from "../../constants";
import { toBearerAuth } from '../header';

export default class Request {
  // Constructor
  constructor(baseUrl = process.env.VUE_APP_SAUNA_URL, contentType = "application/json") {
    this.contentType = contentType;
    this.api = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
    });

    this.api.interceptors.response.use(this.handleSuccess, this.handleError);
  }

  // Build headers request
  headers() {
    let token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    const defaultHeaders = {
      'Content-Type': this.contentType,
      Accept: this.contentType,
    };
    if (token) {
      return {
        headers: {
          ...defaultHeaders,
          Authorization: toBearerAuth(token),
        }
      };
    }
    return {
      headers: {
        ...defaultHeaders,
      }
    };
  }

  // Handle success
  handleSuccess(response) {
    return Promise.resolve(response.data);
  }

  // Handle error
  async handleError(error) {
    return Promise.reject(error.response);
  }

  // Method get
  get(path, params) {
    return this.api.request({
      method: "GET",
      url: path,
      params: params,
      ...this.headers(),
    });
  }

  // Method post
  post(path, payload) {
    return this.api.request({
      method: "POST",
      url: path,
      data: payload,
      ...this.headers(),
    });
  }

  // Method patch
  patch(path, payload) {
    return this.api.request({
      method: "PATCH",
      url: path,
      data: payload,
      ...this.headers(),
    });
  }

  // Method put
  put(path, payload) {
    return this.api.request({
      method: "PUT",
      url: path,
      data: payload,
      ...this.headers(),
    });
  }

  // Method delete
  delete(path, payload) {
    return this.api.request({
      method: "DELETE",
      url: path,
      data: payload,
      ...this.headers(),
    });
  }
}
