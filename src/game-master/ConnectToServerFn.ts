import { createConnection } from 'net';

export function ConnectToServer(serverHostname: string, serverPort: number) {
  const socket = createConnection({ host: serverHostname, port: serverPort });
  const connectedPromise = new Promise((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });

  return {
    connectedPromise,
    socket
  };
}
