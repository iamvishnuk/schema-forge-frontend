import axios from 'axios';
import { redirect } from 'next/navigation';

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000
};

const API = axios.create(options);

export const handleUnauthorized = () => {
  redirect('/auth/login');
};

API.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    // Handle case when there's no response (network error)
    if (!error.response) {
      return Promise.reject({
        status: 'error',
        message: 'Network error occurred'
      });
    }

    const { data, status } = error.response;

    // Handle JWT-related authentication errors
    if (
      status === 401 &&
      (data.message?.includes('Invalid token') ||
        data.message?.includes('token has expired'))
    ) {
      handleUnauthorized();
      return Promise.reject({
        status: 'error',
        message: data.message || 'Unauthorized access',
        statusCode: 401
      });
    }

    // For other error responses, return the error data
    // This matches the backend's error response structure
    return Promise.reject({
      status: data.status || 'error',
      message: data.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' &&
        data.stack && { stack: data.stack })
    });
  }
);

export default API;
