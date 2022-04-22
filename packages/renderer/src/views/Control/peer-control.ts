import { ActionType, DataType, MouseData } from './types/index';
const EventEmitter = require('events');
const peer = new EventEmitter();
const { ipcRenderer, desktopCapturer } = require('electron');
const pc = new window.RTCPeerConnection({});

// const getScreenStream = async () => {
//   const sources = await desktopCapturer.getSources({ types: ['screen'] });
//   // @ts-ignore
//   navigator.webkitGetUserMedia(
//     {
//       audio: false,
//       video: {
//         mandatory: {
//           chromeMediaSource: 'desktop',
//           chromeMediaSourceId: sources[0].id,
//           maxWidth: window.screen.width,
//           maxHeight: window.screen.height,
//         },
//       },
//     },
//     (stream: string) => {
//       peer.emit('add-stream', stream);
//     },
//     (err: string) => {
//       console.log(err);
//     }
//   );
// };
let dc = pc.createDataChannel('robotchannel');
console.log('before-opened', dc);
dc.onopen = function () {
  console.log('opened');
  peer.on('robot', (type: ActionType, data: DataType) => {
    dc.send(JSON.stringify({ type, data }));
  });
};
dc.onmessage = function (event) {
  console.log('message', event);
};
dc.onerror = (e) => {
  console.log(e);
};
async function createOffer() {
  let offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  });
  await pc.setLocalDescription(offer);
  console.log('create-offer\n', JSON.stringify(pc.localDescription));
  return pc.localDescription;
}
createOffer().then((offer) => {
  console.log('forward', 'offer', offer);
  if (offer) {
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
  }
});

async function setRemote(answer: RTCSessionDescriptionInit) {
  await pc.setRemoteDescription(answer);
  console.log('create-answer', pc);
}

ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer);
});

ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate);
});

// window.setRemote = setRemote;

pc.onicecandidate = (e) => {
  console.log('candidate', JSON.stringify(e.candidate));
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate));
  }
  // 告知其他人
};
let candidates: RTCIceCandidateInit[] = [];
async function addIceCandidate(candidate: RTCIceCandidateInit) {
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
// window.addIceCandidate = addIceCandidate;

// @ts-ignore
pc.onaddstream = (e) => {
  console.log('addstream', e);
  peer.emit('add-stream', e.stream);
};

export default peer;
