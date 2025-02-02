import io from 'socket.io-client';
import { config } from './config';

export const socket = io(config.GAME_URL.slice(0, -4), {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  console.log('disconnected');
});

socket.on('error', (error) => {
  console.log(error);
});
