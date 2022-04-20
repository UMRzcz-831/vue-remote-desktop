import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import { useMessage } from 'naive-ui';

const msger = useMessage();

// 接口前缀
const BASE_URL = 'http://api.umr831.com/serve/';

const instance = axios.create({
  baseURL: `${BASE_URL}`,
});

// axios.defaults = {
//   ...axios.defaults,
//   baseURL: `${BASE_URL}`,
// };

const token = localStorage.getItem('token') || '';

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
    authorization: token,
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
    if (code === 200) {
      return Promise.resolve(data);
    } else {
      msger.error(errMsg);
      return Promise.reject(response);
    }
  },
  (error) => {
    msger.error('服务器开小差了');
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
