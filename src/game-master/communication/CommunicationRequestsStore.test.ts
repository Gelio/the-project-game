import { CommunicationRequestsStore } from './CommunicationRequestsStore';

describe('[GM] CommunicationRequestsStore', () => {
  let store: CommunicationRequestsStore;

  beforeEach(() => {
    store = new CommunicationRequestsStore();
  });

  describe('isRequestPending', () => {
    it('should return false when request is not pending', () => {
      const result = store.isRequestPending('p1', 'p2');

      expect(result).toBe(false);
    });

    it('should return true when request is pending', () => {
      store.addPendingRequest('p1', 'p2');

      const result = store.isRequestPending('p1', 'p2');

      expect(result).toBe(true);
    });
  });

  describe('addPendingRequest', () => {
    it('should add a pending request', () => {
      store.addPendingRequest('p1', 'p2');

      const result = store.isRequestPending('p1', 'p2');
      expect(result).toBe(true);
    });

    it('should throw an error when adding the same request twice', () => {
      store.addPendingRequest('p1', 'p2');

      expect(() => store.addPendingRequest('p1', 'p2')).toThrow();
    });
  });

  describe('removePendingRequest', () => {
    it('should remove a pending request', () => {
      store.addPendingRequest('p1', 'p2');
      store.removePendingRequest('p1', 'p2');

      const result = store.isRequestPending('p1', 'p2');
      expect(result).toBe(false);
    });

    it('should throw an error when removing a non-existing request', () => {
      expect(() => store.removePendingRequest('p1', 'p2')).toThrow();
    });
  });
});
