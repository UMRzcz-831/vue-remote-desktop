import { ipcMain } from 'electron';
import { send as sendMainWindow } from '../index';
import { createControlWindow } from '../control';
import signal from '../signal';

const handleIPC = () => {
  ipcMain.handle('registLocal', async () => {
    const {code} = await signal.invoke?.('registLocal', null, 'registed');
    return code.toString();
  });

  ipcMain.on('control', async (e, remoteCode) => {
    sendMainWindow('control-state-change', remoteCode, 1);
    await createControlWindow();
  });
};

export default handleIPC;
