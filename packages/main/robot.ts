import { ipcMain } from 'electron';
import robot from 'robotjs';
import vkey from 'vkey';

type ActionType = 'mouse' | 'keyboard';

type Screen = {
  width: number;
  height: number;
};

type MouseData = {
  clientX: number;
  clientY: number;
  screen: Screen;
  video: Screen;
};

type KeyData = {
  keyCode: number;
  meta: boolean;
  alt: boolean;
  ctrl: boolean;
  shift: boolean;
};

type DataType = MouseData | KeyData;

function handleMouse(data: MouseData) {
  let x = (data.clientX * data.video.width) / data.screen.width;
  let y = (data.clientY * data.video.height) / data.screen.height;
  robot.moveMouse(x, y);
  robot.mouseClick();
}

function handleKey(data: KeyData) {
  // {keyCode,meta,alt,ctrl,shift} = data
  const modifiers = [];
  if (data.meta) {
    modifiers.push('meta');
  }
  if (data.alt) {
    modifiers.push('alt');
  }
  if (data.ctrl) {
    modifiers.push('ctrl');
  }
  if (data.shift) {
    modifiers.push('shift');
  }
  // 获取键盘码
  const key = vkey[data.keyCode].tolowercase();
  if (key[0] !== '<') {
    robot.keyTap(key, modifiers);
  }
}

function Robot() {
  ipcMain.on('robot', (e, type: ActionType, data: DataType) => {
    console.log('data', data);
    if (type === 'mouse') {
      handleMouse(data as MouseData);
    } else if (type === 'keyboard') {
      handleKey(data as KeyData);
    }
  });
}

export default Robot;
