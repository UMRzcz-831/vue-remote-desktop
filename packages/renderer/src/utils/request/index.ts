import axios, { AxiosResponse } from 'axios';

// 接口前缀
const BASE_URL = 'http://api.umr831.com/serve/';

const instance = axios.create({
  baseURL: `${BASE_URL}`,
});

const token = localStorage.getItem('token') || '';

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
  (response) => {
    if (response && response.data) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject('response 不存在');
    }
  },
  (error) => {
    console.log('-- error --');
    console.log(error);
    console.log('-- error --');
    return Promise.reject({
      success: false,
      msg: error,
    });
  }
);

export default instance;
