import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import { useStorageAsync } from '@vueuse/core';
import router from '../../router';

const token = useStorageAsync('token', '');

// 接口前缀
const BASE_URL = 'http://api.umr831.com/serve/';

const instance = axios.create({
  baseURL: `${BASE_URL}`,
});

// axios.defaults = {
//   ...axios.defaults,
//   baseURL: `${BASE_URL}`,
// };

export type RequestResponse<T = any> = {
  data: T;
};

interface StringObject {
  // key 的类型为 string ，一般都代表是对象
  // 限制 value 的类型为 string
  [index: string]: any;
}

interface RequestMethodIn<R = false> {
  <T = any>(url: string, options: AxiosRequestConfig): Promise<T>;
  <T = any>(url: string, options?: AxiosRequestConfig): R extends true
    ? Promise<RequestResponse<T>>
    : Promise<T>;
}

instance.interceptors.request.use(({ headers, ...restConfig }) => ({
  ...restConfig,
  headers: {
    ...headers,
    authorization: token.value,
  },
  params: {
    ...(restConfig.params || {}),
    timestamp: +new Date(),
  },
}));

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data = {} } = response;
    const { msg: errMsg = '服务器开小差了', code } = data;
    if (code !== 401) {
      return Promise.resolve(data);
    } else {
      token.value = null;
      router.push('/login');
      return Promise.reject(errMsg);
    }
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

/**
 * 请求
 * @param url {string}
 * @param option {{method: 'GET' | 'POST', params: Object, data: Object}}
 * @return {AxiosPromise}
 */
const request: RequestMethodIn = (
  url: string,
  option?: StringObject
): AxiosPromise => {
  const options = {
    url,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    ...option,
  };

  return instance(options);
};

export default request;
