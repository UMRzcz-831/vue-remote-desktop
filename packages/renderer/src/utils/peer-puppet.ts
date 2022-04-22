import { desktopCapturer, ipcRenderer } from 'electron';
import { MouseData } from '../views/Control/types';

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
  try {
    // @ts-ignore
    pc.addStream(screenStream);
  } catch (error) {
    console.log('add-stream-err', error);
  }
  try {
    await pc.setRemoteDescription(offer);
  } catch (error) {
    console.log('setRemote fail', error, offer);
  }
  try {
    await pc.setLocalDescription(await pc.createAnswer());
  } catch (error) {
    console.log('set local fail', error);
  }
  // console.log('create answer \n', JSON.stringify(pc.localDescription));

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
  if (!candidate) return;
  candidates.push(candidate);
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let can of candidates) {
      await pc.addIceCandidate(new RTCIceCandidate(can));
    }
    candidates = [];
  }
}

ipcRenderer.on('candidate', async (e, candidate) => {
  let can = {};
  try {
    can = JSON.parse(candidate.data);
  } catch (error) {
    console.log('parse candidate fail', error, candidate.data);
  }
  await addIceCandidate(can);
});

ipcRenderer.on('offer', async (e, offer) => {
  const answer = await createAnswer(offer.data);
  ipcRenderer.send('forward', 'answer', {
    type: answer.type,
    sdp: answer.sdp,
  });
});
