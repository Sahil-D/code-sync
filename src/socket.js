import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket', 'polling'],
  };

  // Using same port and url as of our react server client, so no need to give socket url
  return io(options);
};
