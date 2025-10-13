import type { AxiosError, AxiosRequestConfig } from 'axios';

import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return AxiosLogger.requestLogger(config);
}, AxiosLogger.errorLogger);

axiosInstance.interceptors.response.use(
  AxiosLogger.responseLogger,
  (error) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      // Clear any stored tokens
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/auth/jwt/sign-in') {
        window.location.href = '/auth/jwt/sign-in';
      }
    }
    
    return AxiosLogger.errorLogger(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({ ...config, ...options, cancelToken: source.token }).then(
    ({ data }) => data
  );

  // @ts-expect-error - cancel is not a valid property of the promise
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/auth/me',
    signIn: '/auth/login',
    signUp: '/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  unidadePrisional: {
    root: '/unidade-prisional',
  },
} as const;
