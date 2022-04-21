import WebSocket from 'ws';
import EventEmitter from 'events';

type Signal = EventEmitter & {
  invoke?: (event: string, data: any, answerEvent: string) => Promise<any>;
  send?: (event: string, data: any) => void;
};

const ws = new WebSocket('ws://api.umr831.com/ws/');
const signal: Signal = new EventEmitter();

ws.on('open', () => {
  console.log('main process connected');
});

ws.on('message', (message: string) => {
  let data;
  try {
    data = JSON.parse(message);
  } catch (error) {
    console.log('message parse error', error);
  }
  signal.emit(data.event, data.data);
});

const send = (event: string, data: any) => {
  ws.send(JSON.stringify({ event, data }));
};

const invoke = (event: string, data: any, answerEvent: string) => {
  return new Promise((resolve, reject) => {
    send(event, data);
    signal.once(answerEvent, resolve);
    setTimeout(() => {
      return reject('timeout');
    }, 10000);
  });
};

signal.send = send;

signal.invoke = invoke;

export default signal;
