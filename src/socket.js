import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };
  console.log(process.env.REACT_APP_VERCEL_URL, ': vercel ');
  return io(process.env.REACT_APP_VERCEL_URL, options);
};
