import request from '../utils/request';
import { CommonResponse } from '../types/common';
import { BindDeviceParams } from './type';
import {
  PreferenceRes,
  LoginRes,
  LoginParams,
  DeviceListRes,
  DeviceDetailRes,
  DeviceDetailParams,
} from './type';
const urls = {
  getUserPreference: '/preference/query',
  login: '/user/login',
  regist: '/user/regist',
  getDeviceList: '/device/list',
  getDeviceDetail: '/device',
  unbindDevice: '/device/unbind',
  bindDevice: '/device/bindDevice',
};

// get请求，后端通过token获取用户信息
export const getUserPreference = async (): Promise<
  CommonResponse<PreferenceRes>
> => {
  return request(urls.getUserPreference, {
    method: 'GET',
  });
};

// login
export const login = async (
  data: LoginParams
): Promise<CommonResponse<LoginRes>> => {
  return request(urls.login, {
    method: 'POST',
    data,
  });
};

// getDevices
export const getDeviceList = async (): Promise<
  CommonResponse<DeviceListRes>
> => {
  return request(urls.getDeviceList, {
    method: 'GET',
  });
};

// getDeviceDetail
export const getDeviceDetail = async (
  params: DeviceDetailParams
): Promise<CommonResponse<DeviceDetailRes>> => {
  return request(`${urls.getDeviceDetail}/${params.deviceId}`, {
    method: 'GET',
  });
};

// unbindDevice
export const unbindDevice = async (
  params: DeviceDetailParams
): Promise<CommonResponse<number>> => {
  return request(`${urls.unbindDevice}/${params.deviceId}`, {
    method: 'DELETE',
  });
};

// bindDevice
export const bindDevice = async (
  params: BindDeviceParams
): Promise<CommonResponse<number>> => {
  return request(urls.bindDevice, {
    method: 'POST',
    data: params,
  });
};
