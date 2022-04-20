import { useStorageAsync } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { getUserPreference } from '../services';
import { PreferenceRes } from '../services/type';
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
        console.log(data);
      }
    } catch (error) {
      msger.error(error as string);
    }
  };

  return { token, preference, setPreference, setToken, reqUserInfo };
});
