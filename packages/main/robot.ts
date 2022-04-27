import { ipcMain } from 'electron';
import robot from 'robotjs';
// @ts-ignore
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
  control: boolean;
  shift: boolean;
};

type DataType = MouseData | KeyData;

const keyMap: Record<string, string> = {
  '<num-0>': 'numpad_0',
  '<num-1>': 'numpad_1',
  '<num-2>': 'numpad_2',
  '<num-3>': 'numpad_3',
  '<num-4>': 'numpad_4',
  '<num-5>': 'numpad_5',
  '<num-6>': 'numpad_6',
  '<num-7>': 'numpad_7',
  '<num-8>': 'numpad_8',
  '<num-9>': 'numpad_9',
  '<space>': 'space',
  '<tab>': 'tab',
  '<enter>': 'enter',
  '<escape>': 'escape',
  '<backspace>': 'backspace',
  '<insert>': 'insert',
  '<delete>': 'delete',
  '<command>': 'command',
  '<shift>': 'shift',
  '<caps-lock>': 'caps_lock',
  '<option>': 'option',
  '<control>': 'control',
  '<alt>': 'alt',
};

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
  if (data.control) {
    modifiers.push('control');
  }
  if (data.shift) {
    modifiers.push('shift');
  }
  // 获取键盘码
  const key = (vkey[data.keyCode] as string).toLowerCase();
  console.log('keys', key, modifiers);
  if (key[0] !== '<') {
    robot.keyTap(key, modifiers);
  } else {
    robot.keyTap(keyMap[key]);
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
