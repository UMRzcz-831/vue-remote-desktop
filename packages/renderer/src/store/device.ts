import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { getDeviceDetail, getDeviceList } from '../services';
import { DeviceListRes, DeviceDetailRes } from '../services/type';
import { first } from 'lodash';

export const useDeviceStore = defineStore('device', () => {
  const msger = useMessage();

  const list = ref<DeviceListRes>([]);
  const detail = ref<Partial<DeviceDetailRes>>({});

  const getDevices = async () => {
    try {
      const { data, success, msg } = await getDeviceList();
      if (success) {
        list.value = data;
        const firstOne = first(data);
        if (firstOne) {
          getDevice(firstOne.deviceId);
        }
      } else {
        msger.error(msg);
      }
    } catch (error) {
      throw error;
    }
  };

  const getDevice = async (deviceId: number) => {
    try {
      const { data, success, msg } = await getDeviceDetail({ deviceId });
      if (success) {
        detail.value = data;
      } else {
        msger.error(msg);
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    list,
    detail,
    getDevices,
    getDevice,
  };
});
