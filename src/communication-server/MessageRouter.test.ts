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
    it('should throw an error when registering GM twice', () => {
      messageRouter.registerGameMasterCommunicator(<any>{});

      expect(() => messageRouter.registerGameMasterCommunicator(<any>{})).toThrow();
    });

    it('should call sendMessage when routing messages', () => {
      const communicator = createMockCommunicator();
      messageRouter.registerGameMasterCommunicator(communicator);
      const message = <any>{};

      messageRouter.sendMessageToGameMaster(message);

      expect(communicator.sendMessage).toHaveBeenCalledTimes(1);
      expect(communicator.sendMessage).toHaveBeenCalledWith(message);
    });
  });

  describe('communicating with Players', () => {
    it('should throw an error when registering a player with existing ID', () => {
      messageRouter.registerPlayerCommunicator(5, <any>{});

      expect(() => messageRouter.registerPlayerCommunicator(5, <any>{})).toThrow();
    });

    it('should call sendMessage based on recipientId when routing messages', () => {
      const communicator = createMockCommunicator();
      messageRouter.registerPlayerCommunicator(5, communicator);
      const message = <any>{
        recipientId: 5
      };

      messageRouter.sendMessageToPlayer(message);

      expect(communicator.sendMessage).toHaveBeenCalledTimes(1);
      expect(communicator.sendMessage).toHaveBeenCalledWith(message);
    });

    it("should throw an error when recipient's communicator is not registered", () => {
      const communicator = createMockCommunicator();
      messageRouter.registerPlayerCommunicator(5, communicator);
      const message = <any>{
        recipientId: 80
      };

      expect(() => messageRouter.sendMessageToPlayer(message)).toThrow();
    });

    it('should handle multiple registered players', () => {
      // tslint:disable-next-line:prefer-array-literal
      const communicators = Array.from(new Array(5)).map(createMockCommunicator);
      communicators.forEach((communicator, index) =>
        messageRouter.registerPlayerCommunicator(index, communicator)
      );

      const message = <any>{
        recipientId: 0
      };

      messageRouter.sendMessageToPlayer(message);

      expect(communicators[0].sendMessage).toHaveBeenCalled();
      communicators.slice(1).forEach(communicator => {
        expect(communicator.sendMessage).not.toHaveBeenCalled();
      });
    });
  });
});
