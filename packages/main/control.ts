import electron, { app, BrowserWindow, shell } from 'electron';
import { release, hostname, platform, version, userInfo } from 'os';
import { join, resolve } from 'path';
let controlWin: BrowserWindow | null = null;

export async function createControlWindow() {
  controlWin = new BrowserWindow({
    title: 'Main window',
    width: 1024,
    height: 576,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    controlWin.loadFile(join(__dirname, '../renderer/control.html'));
    console.log('path', join(__dirname, '../renderer/control.html'));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/control`;

    controlWin.loadURL(url);
    controlWin.webContents.openDevTools();
    console.log('control');
  }

  // Communicate with the Renderer-process.
}

export const send = (channel: string, ...args: any[]) => {
  controlWin?.webContents.send(channel, ...args);
};

export const close = () => {
  controlWin?.close();
};
