// eslint disable 
import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import {
  NEmpty,
  NDivider,
  NList,
  NListItem,
  NAvatar,
  NForm,
  NFormItem,
} from 'naive-ui';
import { useDeviceStore } from '../../store/device';
import './index.scss';
import { detailList } from './config';
import { isEmpty } from 'lodash';

const Devices = defineComponent({
  setup() {
    onMounted(() => {
      getDevices();
    });

    const deviceSetup = useDeviceStore();
    const { getDevices, getDevice } = deviceSetup;
    const { list, detail } = storeToRefs(deviceSetup);
    const handleSelectDevice = (deviceId: number) => {
      getDevice(deviceId);
    };

    return () => (
      <div
        class="devices-wrapper"
        style={{
          'justify-content': isEmpty(list) ? 'center' : 'unset',
          'align-items': isEmpty(list) ? 'center' : 'unset',
        }}
      >
        {isEmpty(list) ? (
          <div class="empty-wrapper">
            <NEmpty size="huge" description="尚未绑定任何设备" />
          </div>
        ) : (
          <>
            <div class="device-list">
              <NList>
                {list.value.map(({ device, deviceId }) => (
                  <NListItem
                  {...{onClick: () => handleSelectDevice(deviceId)} as any}
                    key={deviceId}
                    v-slots={{
                      prefix: () => (
                        <div class="device-list-item-prefix">
                          <NAvatar round size={60}>
                            {device.hostname.substring(0, 1).toUpperCase()}
                          </NAvatar>
                        </div>
                      ),
                    }}
                  >
                    <span class="device-item-hostname">{device.hostname}</span>
                  </NListItem>
                ))}
              </NList>
            </div>
            <div class="device-detail">
              <NDivider title-placement="left">
                <div class="device-detail-title">设备详情</div>
              </NDivider>
              <div class="device-detail-content">
                <NForm label-placement="left" label-width="auto" size="large" show-feedback={false} >
                  {detailList.map(({ label, key, editable }) => (
                      <NFormItem label={label}>
                        <div class="device-detail-item-view">
                          {detail.value[key as keyof typeof detail.value] || 'N/A'}
                        </div>
                      </NFormItem>
                  ))}
                </NForm>
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
});

export default Devices;
