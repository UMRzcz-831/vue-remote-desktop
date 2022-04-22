import { useStorageAsync } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { release, hostname, platform, version, userInfo } from 'os';
import { ref, watch } from 'vue';
import { bindDevice, getUserPreference } from '../services';
import { BindDeviceParams, PreferenceRes } from '../services/type';
export const useUserStore = defineStore('user', () => {
  const msger = useMessage();

  /**
   * token hook
   */
  const token = useStorageAsync('token', localStorage.getItem('token') || '');

  // token监听
  const tokenWatch = watch(token, (newV) => {
    if (newV) {
      console.log('got change', newV);
      reqUserInfo();
    }
  });
  // setToken
  const setToken = (val: string | null) => {
    token.value = val;
  };

  /**
   * preference hook
   */
  const preference = ref<Partial<PreferenceRes>>({});
  // setPreference
  const setPreference = (pref: Partial<PreferenceRes>) => {
    preference.value = { ...pref };
  };
  // 请求用户信息
  const reqUserInfo = async () => {
    try {
      const { data, success } = await getUserPreference();
      if (success) {
        setPreference(data);
        getDeviceInfo();
        await tryBindDevice(deviceInfo.value as BindDeviceParams);
      }
    } catch (error) {
      msger.error(error as string);
    }
  };

  const deviceInfo = ref<BindDeviceParams>();

  const getDeviceInfo = () => {
    deviceInfo.value = {
      hostname: hostname(),
      osPlatform: platform(),
      osVersion: version(),
      osAdmin: userInfo().username,
    };
  };

  const tryBindDevice = async (deviceInfo: BindDeviceParams) => {
    try {
      const { success, msg } = await bindDevice(deviceInfo);
      console.log(msg, success);
    } catch (error) {
      throw error;
    }
  };

  return {
    token,
    preference,
    setPreference,
    setToken,
    reqUserInfo,
    getDeviceInfo,
  };
});
