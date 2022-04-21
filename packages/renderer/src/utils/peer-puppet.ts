import { desktopCapturer, ipcRenderer } from 'electron';
import { MouseData } from '../views/Control/types';

const pc = new RTCPeerConnection({});

pc.ondatachannel = (e) => {
  console.log(e);
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
      reject
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

  return pc.localDescription;
}
pc.onicecandidate = (e) => {
  console.log('candidate', JSON.stringify(e.candidate));
  ipcRenderer.send('forward', 'control-candidate', e.candidate);
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
// @ts-ignore
window.createAnswer = createAnswer;
// @ts-ignore
window.addIceCandidate = addIceCandidate;