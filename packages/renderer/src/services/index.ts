import request from '../utils/request';
import { CommonResponse } from '../types/common';
import { PreferenceRes } from './type';
const urls = {
  getUserPreference: '/preference/query',
  login: '/user/login',
  regist: '/user/regist',
};

// get请求，后端通过token获取用户信息
export const getUserPreference = async (): Promise<
  CommonResponse<PreferenceRes>
> => {
  return request(urls.getUserPreference, {
    method: 'GET',
  });
};
