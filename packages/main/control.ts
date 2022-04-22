import electron, { app, BrowserWindow, shell } from 'electron';
import { release, hostname, platform, version, userInfo } from 'os';
import { join, resolve } from 'path';
let win: BrowserWindow | null = null;

export async function createControlWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1024,
    height: 576,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html/#/control'));
    console.log('path', join(__dirname, '../renderer/index.html'));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/control`;

    win.loadURL(url);
    win.webContents.openDevTools();
    console.log(
      JSON.stringify({
        hostname: hostname(),
        platform: platform(),
        version: version(),
        osAdmin: userInfo().username,
      })
    );
  }

  // Communicate with the Renderer-process.
}

export const send = (channel: string, ...args: any[]) => {
  win?.webContents.send(channel, ...args);
};
