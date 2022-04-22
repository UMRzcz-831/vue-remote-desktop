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
  NButton,
  NPopconfirm,
  useMessage,
} from 'naive-ui';
import { useDeviceStore } from '../../store/device';
import './index.scss';
import { detailList } from './config';
import { isEmpty } from 'lodash';
import { unbindDevice } from '../../services';

const Devices = defineComponent({
  setup() {
    onMounted(() => {
      getDevices();
    });

    const active = ref(0);
    const msger = useMessage();
    const deviceSetup = useDeviceStore();
    const { getDevices, getDevice } = deviceSetup;
    const { list, detail } = storeToRefs(deviceSetup);
    const handleSelectDevice = (deviceId: number) => {
      active.value = deviceId;
      getDevice(deviceId);
    };

    const handleUnbind = async () => {
      try {
        console.log(detail.value.id);
        const { success } = await unbindDevice({
          deviceId: detail.value.id as number,
        });
        if (success) {
          msger.success('解绑成功');
          await getDevices();
          active.value = 0;
        }
      } catch (error) {}
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
                {!isEmpty(list.value) &&
                  list.value.map(({ device, deviceId }) => (
                    <NListItem
                      class={`device-item ${
                        deviceId === active.value ? 'active' : ''
                      }`}
                      {...({
                        onClick: () => handleSelectDevice(deviceId),
                      } as any)}
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
                      <span class="device-item-hostname">
                        {device.hostname}
                      </span>
                    </NListItem>
                  ))}
              </NList>
            </div>
            <div class="device-detail">
              <NDivider title-placement="left">
                <div class="device-detail-title">设备详情</div>
              </NDivider>
              <div class="btns">
                <NButton ghost type="info">
                  修改
                </NButton>
                <NPopconfirm
                  positiveText="确定"
                  negativeText="取消"
                  onPositiveClick={handleUnbind}
                  v-slots={{
                    trigger: () => (
                      <NButton ghost type="error">
                        解绑
                      </NButton>
                    ),
                  }}
                >
                  <span>确定解绑吗？</span>
                </NPopconfirm>
              </div>
              <div class="device-detail-content">
                <NForm
                  label-placement="left"
                  label-width="auto"
                  size="large"
                  show-feedback={false}
                >
                  {detailList.map(({ label, key, editable }) => (
                    <NFormItem label={label}>
                      <div class="device-detail-item-view">
                        {detail.value[key as keyof typeof detail.value] ||
                          'N/A'}
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
