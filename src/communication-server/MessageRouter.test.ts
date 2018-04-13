import { Communicator } from '../common/Communicator';
import { MessageRouter } from './MessageRouter';

function createMockCommunicator(): Communicator {
  return <any>{
    sendMessage: jest.fn()
  };
}

describe('[CS] MessageRouter', () => {
  let messageRouter: MessageRouter;

  beforeEach(() => {
    messageRouter = new MessageRouter();
  });

  afterEach(() => {
    messageRouter.unregisterAll();
  });

  describe('communicating with Game Master', () => {
    it('should throw an error when registering GM for the same game name twice', () => {
      const gameName = 'abc';
      messageRouter.registerGameMasterCommunicator(gameName, <any>{});

      expect(() => messageRouter.registerGameMasterCommunicator(gameName, <any>{})).toThrow();
    });

    it('should call sendMessage when routing messages', () => {
      const communicator = createMockCommunicator();
      messageRouter.registerGameMasterCommunicator('abc', communicator);
      const message = <any>{};

      messageRouter.sendMessageToGameMaster('abc', message);

      expect(communicator.sendMessage).toHaveBeenCalledTimes(1);
      expect(communicator.sendMessage).toHaveBeenCalledWith(message);
    });

    it('should throw an error when sending a message to a non-registered GM', () => {
      const message = <any>{};

      expect(() => messageRouter.sendMessageToGameMaster('abc', message)).toThrow();
    });
  });

  describe('communicating with Players', () => {
    it('should throw an error when registering a player with existing ID', () => {
      messageRouter.registerPlayerCommunicator('uuid', <any>{});

      expect(() => messageRouter.registerPlayerCommunicator('uuid', <any>{})).toThrow();
    });

    it('should call sendMessage based on recipientId when routing messages', () => {
      const communicator = createMockCommunicator();
      messageRouter.registerPlayerCommunicator('uuid', communicator);
      const message = <any>{
        recipientId: 'uuid'
      };

      messageRouter.sendMessageToPlayer(message);

      expect(communicator.sendMessage).toHaveBeenCalledTimes(1);
      expect(communicator.sendMessage).toHaveBeenCalledWith(message);
    });

    it("should throw an error when recipient's communicator is not registered", () => {
      const communicator = createMockCommunicator();
      messageRouter.registerPlayerCommunicator('uuid', communicator);
      const message = <any>{
        recipientId: 'someid'
      };

      expect(() => messageRouter.sendMessageToPlayer(message)).toThrow();
    });

    it('should handle multiple registered players', () => {
      // tslint:disable-next-line:prefer-array-literal
      const communicators = Array.from(new Array(5)).map(createMockCommunicator);
      communicators.forEach((communicator, index) =>
        messageRouter.registerPlayerCommunicator(index.toString(), communicator)
      );

      const message = <any>{
        recipientId: '0'
      };

      messageRouter.sendMessageToPlayer(message);

      expect(communicators[0].sendMessage).toHaveBeenCalled();
      communicators.slice(1).forEach(communicator => {
        expect(communicator.sendMessage).not.toHaveBeenCalled();
      });
    });
  });

  describe('hasRegisteredGameMasterCommunicator', () => {
    it('should return true when a GM is registered', () => {
      const communicator = createMockCommunicator();
      messageRouter.registerGameMasterCommunicator('abc', communicator);

      expect(messageRouter.hasRegisteredGameMasterCommunicator('abc')).toBe(true);
    });

    it('should return false when a GM is not registered', () => {
      expect(messageRouter.hasRegisteredGameMasterCommunicator('abc')).toBe(false);
    });
  });
});
