import { ipcMain } from 'electron';
import { send as sendMainWindow } from '../index';
import {
  createControlWindow,
  send as sendControlWindow,
  close as closeConrtolWindow,
} from '../control';
import signal from '../signal';

const handleIPC = () => {
  ipcMain.handle('registLocal', async () => {
    const { code } = await signal.invoke?.('registLocal', null, 'registed');
    return code.toString();
  });

  ipcMain.on('control', async (e, remoteCode) => {
    signal.send?.('control', { remote: remoteCode });
  });

  ipcMain.on('stop-control', async (e) => {
    signal.send?.('stop-control', null);
    sendMainWindow('control-state-change', '', 0);
    closeConrtolWindow();
  });

  signal.on('remoteNotFound', (data) => {
    console.log(data);
    sendMainWindow('remote-notFound', data);
  });

  signal.on('controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 1);
    createControlWindow();
  });

  signal.on('beControlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2);
  });

  signal.on('end-stream', (data) => {
    sendMainWindow('control-state-change', '', 0);
  });

  ipcMain.on('forward', (e, event, data) => {
    signal.send?.('forward', { event, data });
  });

  signal.on('offer', (data) => {
    sendMainWindow('offer', data);
  });

  signal.on('answer', (data) => {
    sendControlWindow('answer', data);
  });

  signal.on('puppet-candidate', (data) => {
    // console.log('puppet-candidate signal receive', data);
    sendControlWindow('candidate', data);
  });

  signal.on('control-candidate', (data) => {
    // console.log('control-candidate signal receive', data);
    sendMainWindow('candidate', data);
  });
};

export default handleIPC;
