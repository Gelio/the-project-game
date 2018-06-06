import { createConnection } from 'net';
import { LoggerInstance } from 'winston';
import { Communicator } from '../common/Communicator';

export function ConnectToServer(
  serverHostname: string,
  serverPort: number,
  logger: LoggerInstance
) {
  const socket = createConnection({ host: serverHostname, port: serverPort });
  const connectedPromise = new Promise((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });

  const communicator = new Communicator(socket, logger);

  return {
    connectedPromise,
    communicator
  };
}
