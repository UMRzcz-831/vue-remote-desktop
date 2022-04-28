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
  NInput,
} from 'naive-ui';
import { useDeviceStore } from '../../store/device';
import './index.scss';
import { detailList } from './config';
import { isEmpty } from 'lodash';
import { unbindDevice } from '../../services';
import { updateDevice } from '../../services/index';

const Devices = defineComponent({
  setup() {
    onMounted(() => {
      getDevices();
    });

    const active = ref(0);
    const msger = useMessage();
    const deviceSetup = useDeviceStore();

    const state = ref('view');
    const { getDevices, getDevice } = deviceSetup;
    const { list, detail } = storeToRefs(deviceSetup);

    const handleSelectDevice = async (index: number, deviceId: number) => {
      active.value = index;
      await getDevice(deviceId);
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

    const handleEdit = () => {
      state.value = 'edit';
    };

    const handleSave = async () => {
      console.log(detail.value);
      try {
        const { success, msg } = await updateDevice(detail.value);
        if (success) {
          msger.success(msg);
          await getDevice(detail.value.id as number);
          state.value = 'view';
        } else {
          msger.error(msg);
        }
      } catch (error) {
        throw error;
      }
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
                  list.value.map(({ device, deviceId }, index) => (
                    <NListItem
                      class={`device-item ${
                        index === active.value ? 'active' : ''
                      }`}
                      {...({
                        onClick: () => handleSelectDevice(index, deviceId),
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
                {state.value === 'view' ? (
                  <NButton ghost type="info" onClick={handleEdit}>
                    修改
                  </NButton>
                ) : (
                  <NButton type="info" onClick={handleSave}>
                    保存
                  </NButton>
                )}

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
                      {state.value === 'edit' && editable ? (
                        <NInput
                          class="edit-input"
                          v-model:value={
                            detail.value[key as keyof typeof detail.value]
                          }
                          placeholder={`请输入${label}`}
                        ></NInput>
                      ) : (
                        <div class="device-detail-item-view">
                          {detail.value[key as keyof typeof detail.value] ||
                            'N/A'}
                        </div>
                      )}
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
