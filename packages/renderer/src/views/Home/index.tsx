import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { NButton, NDivider, NForm, NFormItem, NInput } from 'naive-ui';
import './index.scss';
import { isEmpty } from 'lodash';
import { desktopCapturer, ipcRenderer } from 'electron';
import { MouseData } from '../Control/types';
// import '../../utils/peer-puppet'

const Home = defineComponent({
  setup() {
    onMounted(() => {
      registLocal();
      ipcRenderer.on('control-state-change', handleControlState);
    });

    onUnmounted(() => {
      ipcRenderer.removeListener('control-state-change', handleControlState);
    });

    const pc = new RTCPeerConnection({});

    pc.ondatachannel = (e) => {
      console.log('datachannel', e);
      e.channel.onmessage = (e) => {
        let { type, data } = JSON.parse(e.data);
        if (type === 'mouse') {
          (data as MouseData).screen = {
            width: window.screen.width,
            height: window.screen.height,
          };
        }
        ipcRenderer.send('robot', type, data);
      };
    };

    // 获取视频流
    async function getScreenStream() {
      const sources = await desktopCapturer.getSources({ types: ['screen'] });
      return new Promise((resolve, reject) => {
        // @ts-ignore
        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[0].id,
                maxWidth: window.screen.width,
                maxHeight: window.screen.height,
              },
            },
          },
          (stream: any) => {
            console.log('add-stream', stream);
            resolve(stream);
          },
          (err: any) => {
            console.log('add-stream-err', err);
            reject(err);
          }
        );
      });
    }

    // 创建RTC answer
    async function createAnswer(offer: RTCSessionDescriptionInit) {
      let screenStream = await getScreenStream();
      // @ts-ignore
      pc.addStream(screenStream);
      await pc.setRemoteDescription(offer);
      await pc.setLocalDescription(await pc.createAnswer());
      console.log('create answer \n', JSON.stringify(pc.localDescription));

      return pc.localDescription as RTCSessionDescription;
    }
    pc.onicecandidate = (e) => {
      console.log('candidate', JSON.stringify(e.candidate));
      if (e.candidate) {
        ipcRenderer.send(
          'forward',
          'puppet-candidate',
          JSON.stringify(e.candidate)
        );
      }
      // 告知其他人
    };
    let candidates: RTCIceCandidateInit[] = [];
    async function addIceCandidate(candidate: RTCIceCandidateInit | null) {
      // @ts-ignore
      if (!candidate || !candidate.type) return;
      candidates.push(candidate);
      if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let i = 0; i < candidates.length; i++) {
          await pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
        }
        candidates = [];
      }
    }

    ipcRenderer.on('candidate', (e, candidate) => {
      addIceCandidate(candidate);
    });

    ipcRenderer.on('offer', async (e, offer) => {
      const answer = await createAnswer(offer);
      ipcRenderer.send('forward', 'answer', {
        type: answer.type,
        sdp: answer.sdp,
      });
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
