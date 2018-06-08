import { createConnection, Socket } from 'net';

export function connectToServer(serverHostname: string, serverPort: number): Promise<Socket> {
  const socket = createConnection({ host: serverHostname, port: serverPort });

  return new Promise((resolve, reject) => {
    socket.once('connect', () => resolve(socket));
    socket.once('error', reject);
  });
}
