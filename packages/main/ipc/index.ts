import { ipcMain } from 'electron';
import { send as sendMainWindow } from '../index';
import { createControlWindow } from '../control';
const handleIPC = () => {
  ipcMain.handle('registLocal', async () => {
    // mock 随机code
    const code = Math.floor(Math.random() * 999999999 - 100000000) + 100000000;
    return code.toString();
  });

  ipcMain.on('control', async (e, remoteCode) => {
    sendMainWindow('control-state-change', remoteCode, 1);
    await createControlWindow();
  });
};

export default handleIPC;
