import { Communicator } from '../common/Communicator';
import { Message } from '../interfaces/Message';
import { MessageWithRecipient } from '../interfaces/MessageWithRecipient';

import { PlayerId } from '../common/EntityIds';
import { GameName } from '../common/GameName';

export class MessageRouter {
  private gmCommunicators: Map<GameName, Communicator> = new Map();
  private playerCommunicators: Map<PlayerId, Communicator> = new Map();

  public registerGameMasterCommunicator(gameName: GameName, communicator: Communicator) {
    if (this.gmCommunicators.has(gameName)) {
      throw new Error('Game Master communicator already registered');
    }

    this.gmCommunicators.set(gameName, communicator);
  }

  public unregisterGameMasterCommunicator(gameName: GameName) {
    this.ensureGameMasterCommunicatorRegistered(gameName);
    this.gmCommunicators.delete(gameName);
  }

  public registerPlayerCommunicator(id: PlayerId, communicator: Communicator) {
    if (this.playerCommunicators.has(id)) {
      throw new Error(`Player with ID ${id} has already registered a communicator`);
    }

    this.playerCommunicators.set(id, communicator);
  }

  public unregisterPlayerCommunicator(id: PlayerId) {
    this.ensurePlayerCommunicatorRegistered(id);
    this.playerCommunicators.delete(id);
  }

  public unregisterAll() {
    const gameNames = Array.from(this.gmCommunicators.keys());
    gameNames.forEach(gameName => this.unregisterGameMasterCommunicator(gameName));

    const playerIds = Array.from(this.playerCommunicators.keys());
    playerIds.forEach(id => this.unregisterPlayerCommunicator(id));
  }

  public sendMessageToPlayer<T>(message: MessageWithRecipient<T>) {
    this.ensurePlayerCommunicatorRegistered(message.recipientId);
    const communicator = <Communicator>this.playerCommunicators.get(message.recipientId);

    communicator.sendMessage(message);
  }

  public sendMessageToGameMaster<T>(gameName: GameName, message: Message<T>) {
    this.ensureGameMasterCommunicatorRegistered(gameName);

    const gmCommunicator = <Communicator>this.gmCommunicators.get(gameName);
    gmCommunicator.sendMessage(message);
  }

  public hasRegisteredGameMasterCommunicator(gameName: GameName) {
    return this.gmCommunicators.has(gameName);
  }

  public hasRegisteredPlayerCommunicator(id: PlayerId) {
    return this.playerCommunicators.has(id);
  }

  private ensureGameMasterCommunicatorRegistered(gameName: GameName) {
    if (!this.gmCommunicators.has(gameName)) {
      throw new Error('Game Master communicator has not been registered');
    }
  }

  private ensurePlayerCommunicatorRegistered(id: PlayerId) {
    if (!this.playerCommunicators.has(id)) {
      throw new Error(`Player with ID ${id} has not registered a communicator`);
    }
  }
}
