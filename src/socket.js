import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };

  // console.log('socket');
  // just for vercel deployment, Trying socket connection without providing link

  // const vercel_deployment_link = process.env.REACT_APP_VERCEL_URL;
  // console.log(vercel_deployment_link, ': vercel deployment link ');

  // return io(options);
  return io();
};
