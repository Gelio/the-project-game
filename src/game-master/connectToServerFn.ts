import { createConnection } from 'net';

export async function connectToServer(serverHostname: string, serverPort: number) {
  const socket = createConnection({ host: serverHostname, port: serverPort });
  const connectedPromise = new Promise((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });

  try {
    await connectedPromise;
  } catch (error) {
    throw new Error(`Failed to establish connection to the server ${serverHostname}:${serverPort}`);
  }

  return socket;
}
