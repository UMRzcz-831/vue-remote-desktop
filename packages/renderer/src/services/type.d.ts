/**
 * 偏好返回
 * example :
 *      "themeName": "夜晚模式",
        "id": 1,
        "userId": 10,
        "nickname": "lulu",
        "avatarUrl": null,
        "theme": "1",
 */
export type PreferenceRes = {
  themeName: string;
  id: number;
  userId: number;
  nickname: string;
  avatarUrl: string | null;
  theme: string;
};

export type LoginParams = {
  username?: string;
  password: string;
  mobile?: string;
  type: 0 | 1; // 0: 用户名密码登录 1: 手机号登录
};

export type LoginRes = {
  token: string;
};

export type DeviceDetailParams = {
  deviceId: number;
};

export type DeviceDetailRes = {
  id: number;
  hostname: string;
  alias: string | null;
  osPlatform: string;
  osVersion: string;
  osAdmin: string;
  ip: string | null;
  created_at: string;
  updated_at: string;
};

export type DeviceListRes = {
  userId: number;
  deviceId: number;
  device: Pick<DeviceDetailRes, 'alias' | 'hostname'>;
}[];

export type BindDeviceParams = {
  hostname: string;
  osPlatform: NodeJS.Platform;
  osVersion: string;
  osAdmin: string;
};

export type UploadParams = FormData

export type UploadRes = {
  url: string;
  hash: string;
  key: string;
};
