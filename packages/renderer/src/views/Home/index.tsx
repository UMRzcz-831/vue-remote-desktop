import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { NButton, NDivider, NForm, NFormItem, NInput } from 'naive-ui';
import './index.scss';
import { isEmpty } from 'lodash';
import { ipcRenderer } from 'electron';
import '../../utils/peer-puppet'

const Home = defineComponent({
  setup() {
    onMounted(() => {
      registLocal();
      ipcRenderer.on('control-state-change', handleControlState);
    });

    onUnmounted(() => {
      ipcRenderer.removeListener('control-state-change', handleControlState);
    });

    const remoteCode = ref('');
    const localCode = ref('');
    const controlText = ref('未连接');

    const registLocal = async () => {
      const code = await ipcRenderer.invoke('registLocal');
      console.log('code', code);
      localCode.value = code;
    };

    const handleStartControl = () => {
      ipcRenderer.send('control', remoteCode.value);
    };

    const handleControlState = (event: any, name: string, type: number) => {
      let text = '';
      if (type === 1) {
        text = `远程控制${name}成功`;
      } else if (type === 2) {
        text = `被${name}远程控制中`;
      }
      controlText.value = text;
    };

    return () => (
      <div class="home-wrapper">
        <div class="local-info">
          <NDivider title-placement="left">
            <div class="local-info-title">允许控制本机</div>
          </NDivider>
          <div class="local-info-content">
            <NForm label-width="auto" size="large">
              <NFormItem label="本机识别码">
                <div class="local-info-local-code">
                  <span>
                    {localCode.value
                      .replace(/\s/g, '')
                      .replace(/(.{3})/g, '$1 ')}
                  </span>
                </div>
              </NFormItem>
            </NForm>
            <NForm label-width="auto" size="large" show-feedback={false}>
              <NFormItem label="本机验证码">
                <div class="local-info-local-verify">
                  <span>2aJBn0</span>
                </div>
              </NFormItem>
            </NForm>
          </div>
        </div>
        <div class="remote-info">
          <NDivider title-placement="left">
            <div class="remote-info-title">远程控制设备</div>
          </NDivider>
          <div class="remote-info-content">
            <NForm label-width="auto" size="large">
              <NFormItem label="远程主机识别码">
                <div class="remote-info-local-id">
                  <NInput
                    placeholder="输入识别码"
                    v-model:value={remoteCode.value}
                  ></NInput>
                </div>
              </NFormItem>
            </NForm>
            <div>{controlText.value}</div>
            <NButton onClick={handleStartControl}>连接</NButton>
          </div>
        </div>
      </div>
    );
  },
});

export default Home;
