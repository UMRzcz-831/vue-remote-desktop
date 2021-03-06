const EventEmitter = require('events');
const peer = new EventEmitter();
const { ipcRenderer, desktopCapturer } = require('electron');
const pc = new window.RTCPeerConnection({});

// const getScreenStream = async () => {
//   const sources = await desktopCapturer.getSources({ types: ['screen'] });
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
//     (stream) => {
//       peer.emit('add-stream', stream);
//     },
//     (err) => {
//       console.log(err);
//     }
//   );
// };
// getScreenStream();
peer.on('robot', (type, data) => {
  if (type === 'mouse') {
    data.screen = {
      width: window.screen.width,
      height: window.screen.height,
    };
  }
  setTimeout(() => {
    ipcRenderer.send('robot', type, data);
  }, 500);
});
// let dc = pc.createDataChannel('robotchannel', { reliable: false });
// console.log('before-opened', dc);
// dc.onopen = function () {
//   console.log('opened');
//   peer.on('robot', (type, data) => {
//     dc.send(JSON.stringify({ type, data }));
//   });
// };
// dc.onmessage = function (event) {
//   console.log('message', event);
// };A
// dc.onerror = (e) => {
//   console.log(e);
// };
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
  ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
});

// ipcRenderer.on('answer', (e, answer) => {
//   setRemote(answer);
// });

// ipcRenderer.on('candidate', (e, candidate) => {
//   addIceCandidate(candidate);
// });

async function setRemote(answer) {
  await pc.setRemoteDescription(answer);
  console.log('create-answer', pc);
}
window.setRemote = setRemote;

pc.onicecandidate = (e) => {
  console.log('candidate', JSON.stringify(e.candidate));
  ipcRenderer.send('forward', 'control-candidate', e.candidate);
  // ???????????????
};
const candidates = [];
async function addIceCandidate(candidate) {
  if (!candidate || !candidate.type) return;
  candidates.push(candidate);
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
    }
    candidates = [];
  }
}
window.addIceCandidate = addIceCandidate;

// pc.onaddstream = (e) => {
//   console.log('addstream', e);
//   peer.emit('add-stream', e.stream);
// };

// ??????robot??????
// peer.on('robot', (type, data) => {
//     console.log('robot', type, data)
//     if(type === 'mouse') {
//         data.screen = {
//             width: window.screen.width,
//             height: window.screen.height
//         }
//     }
//     setTimeout(() => {
//     ipcRenderer.send('robot', type, data)
//     }, 2000)
//
// })
module.exports = peer;
