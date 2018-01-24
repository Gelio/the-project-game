import { Communicator } from '../common/communicator';
import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

export class MessageRouter {
  private gmCommunicator: Communicator | null = null;
  private playerCommunicators: Map<number, Communicator> = new Map();

  public registerGameMasterCommunicator(communicator: Communicator) {
    if (this.gmCommunicator) {
      throw new Error('Game Master communicator already registered');
    }

    this.gmCommunicator = communicator;
  }

  public unregisterGameMasterCommunicator() {
    this.ensureGameMasterCommunicatorRegistered();
    this.gmCommunicator = null;
  }

  public registerPlayerCommunicator(id: number, communicator: Communicator) {
    if (this.playerCommunicators.has(id)) {
      throw new Error(`Player with ID ${id} has already registered a communicator`);
    }

    this.playerCommunicators.set(id, communicator);
  }

  public unregisterPlayerCommunicator(id: number) {
    this.ensurePlayerCommunicatorRegistered(id);
    this.playerCommunicators.delete(id);
  }

  public unregisterAll() {
    if (this.gmCommunicator) {
      this.unregisterGameMasterCommunicator();
    }

    const playerIds = Array.from(this.playerCommunicators.keys());
    playerIds.forEach(id => this.unregisterPlayerCommunicator(id));
  }

  public sendMessageToPlayer<T>(message: MessageWithRecipient<T>) {
    this.ensurePlayerCommunicatorRegistered(message.recipientId);
    const communicator = <Communicator>this.playerCommunicators.get(message.recipientId);

    communicator.sendMessage(message);
  }

  public sendMessageToGameMaster<T>(message: Message<T>) {
    this.ensureGameMasterCommunicatorRegistered();

    (<Communicator>this.gmCommunicator).sendMessage(message);
  }

  private ensureGameMasterCommunicatorRegistered() {
    if (!this.gmCommunicator) {
      throw new Error('Game Master communicator has not been registered');
    }
  }

  private ensurePlayerCommunicatorRegistered(id: number) {
    if (!this.playerCommunicators.has(id)) {
      throw new Error(`Player with ID ${id} has not registered a communicator`);
    }
  }
}
