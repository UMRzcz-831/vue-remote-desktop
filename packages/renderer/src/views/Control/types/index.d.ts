export type ActionType = 'mouse' | 'keyboard';

export type Screen = {
  width: number;
  height: number;
};

export type MouseData = {
  clientX: number;
  clientY: number;
  screen: Screen;
  video: Screen;
};

export type KeyData = {
  keyCode: number;
  meta: boolean;
  alt: boolean;
  ctrl: boolean;
  shift: boolean;
};

export type DataType = MouseData | KeyData;