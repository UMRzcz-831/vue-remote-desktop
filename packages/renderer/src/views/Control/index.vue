<template>
  <video ref="videoStreamRef"></video>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineComponent } from 'vue';
import peer from './peer-control';
import { MouseData } from './types';

const videoStreamRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  peer.on('add-stream', (stream: MediaProvider) => {
    console.log('play stream', videoStreamRef.value);
    play(stream);
  });
});

function play(stream: MediaProvider) {
  videoStreamRef.value!.srcObject = stream;
  videoStreamRef.value!.onloadedmetadata = function () {
    videoStreamRef.value!.play();
  };
}

window.onkeydown = function (e) {
  // data {keyCode, meta, alt, ctrl, shift}
  let data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    control: e.ctrlKey,
    alt: e.altKey,
  };
  peer.emit('robot', 'key', data);
};

window.onmouseup = function (e) {
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let data: Partial<MouseData> = {};
  data.clientX = e.clientX;
  data.clientY = e.clientY;
  data.video = {
    width: videoStreamRef.value!.getBoundingClientRect().width,
    height: videoStreamRef.value!.getBoundingClientRect().height,
  };
  peer.emit('robot', 'mouse', data);
};
</script>
