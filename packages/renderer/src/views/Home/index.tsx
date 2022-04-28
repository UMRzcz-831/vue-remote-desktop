import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import {
  NButton,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  useNotification,
} from 'naive-ui';
import './index.scss';
import { ipcRenderer } from 'electron';
import { useHomeStore } from '../../store/home';
import '../../utils/peer-puppet';

const Home = defineComponent({
  setup() {
    onMounted(() => {
      registLocal();
      ipcRenderer.on('control-state-change', handleControlState);

      ipcRenderer.on('remote-notFound', handleCodeNotFound);
    });

    onUnmounted(() => {
      ipcRenderer.removeListener('control-state-change', handleControlState);
    });

    const homeSetup = useHomeStore();
    const { setLocalCode } = homeSetup;
    const { localCode } = storeToRefs(homeSetup);
    const notify = useNotification();
    const remoteCode = ref('');
    const controlText = ref('未连接');
    const status = ref<number>(0);

    const registLocal = async () => {
      const code = await ipcRenderer.invoke('registLocal');
      console.log('code', code);
      setLocalCode(code);
    };

    const handleStartControl = () => {
      ipcRenderer.send('control', remoteCode.value);
    };

    const handleStopControl = () => {
      ipcRenderer.send('stop-control');
    };

    const handleCodeNotFound = (e: any, data: { remote: number }) => {
      notify.warning({
        content: `未找到识别码为${data.remote}的机器`,
        duration: 3000,
      });
    };

    const handleControlState = (event: any, name: string, type: number) => {
      let text = '';
      if (type === 1) {
        text = `远程控制${name}成功`;
      } else if (type === 2) {
        text = `被${name}远程控制中`;
      }else{
        text = `未连接`;
      }
      controlText.value = text;
      status.value = type;
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
            {/* <NForm label-width="auto" size="large" show-feedback={false}>
              <NFormItem label="本机验证码">
                <div class="local-info-local-verify">
                  <span>2aJBn0</span>
                </div>
              </NFormItem>
            </NForm> */}
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
            {[1, 2].includes(status.value) ? (
              <NButton type="primary" onClick={handleStopControl}>
                结束控制
              </NButton>
            ) : (
              <NButton onClick={handleStartControl}>连接</NButton>
            )}
          </div>
        </div>
      </div>
    );
  },
});

export default Home;
