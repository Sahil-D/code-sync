import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };

  // jsut for vercel deployment
  const vercel_deployment_link = 'https://' + process.env.REACT_APP_VERCEL_URL;

  console.log(vercel_deployment_link, ': vercel deployment link ');
  return io(vercel_deployment_link, options);
};
