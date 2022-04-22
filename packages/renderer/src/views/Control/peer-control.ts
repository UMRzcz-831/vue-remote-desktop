import { ActionType, DataType, MouseData } from './types/index';
const EventEmitter = require('events');
const peer = new EventEmitter();
const { ipcRenderer, desktopCapturer } = require('electron');
const pc = new window.RTCPeerConnection({});

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
  console.log('dc error', e);
};
async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  });
  await pc.setLocalDescription(offer);
  // console.log('control create-offer\n', JSON.stringify(pc.localDescription));
  return pc.localDescription;
}
createOffer().then((offer) => {
  console.log('forward', 'offer', offer);
  if (offer) {
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
  }
});

async function setRemote(answer: RTCSessionDescriptionInit) {
  console.log('set remote', answer);
  await pc.setRemoteDescription(answer);
}

ipcRenderer.on('answer', (e, answer) => {
  console.log('control answer', answer);
  setRemote(answer.data);
});

ipcRenderer.on('candidate', async (e, candidate) => {
  let can = {};
  try {
    can = JSON.parse(candidate.data);
  } catch (error) {
    console.log('parse candidate fail', error, candidate.data);
  }
  console.log('control candidate', can);
  await addIceCandidate(can);
});

// window.setRemote = setRemote;

pc.onicecandidate = (e) => {
  console.log('candidate', JSON.stringify(e.candidate));
  if (e.candidate) {
    ipcRenderer.send(
      'forward',
      'control-candidate',
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
// window.addIceCandidate = addIceCandidate;

// @ts-ignore
pc.onaddstream = (e) => {
  console.log('addstream', e);
  peer.emit('add-stream', e.stream);
};

export default peer;
