import axios from 'axios';
import { getDomain } from './domainUtils';

export const api = axios.create({
  baseURL: getDomain(),
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((request) => {
  request.headers.Authorization = localStorage.getItem("token");
  return request;
})

export const handleError = error => {
  const response = error.response;

  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    return response.data.message;
  } else {
    if (error.message.match(/Network Error/)) {
      return 'The server could not be reached';
    }
    return error.message;
  }
};
