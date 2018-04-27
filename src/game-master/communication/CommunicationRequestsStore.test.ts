import { CommunicationRequestsStore } from './CommunicationRequestsStore';

describe('[GM] CommunicationRequestsStore', () => {
  let store: CommunicationRequestsStore;

  beforeEach(() => {
    store = new CommunicationRequestsStore();
  });

  it('should properly store pending requests', () => {
    store.addPendingRequest('p1', 'p2');

    const result = store.isRequestPending('p1', 'p2');

    expect(result).toBe(true);
  });

  describe('isRequestPending', () => {
    it('should return false when request is not pending', () => {
      const result = store.isRequestPending('p1', 'p2');

      expect(result).toBe(false);
    });
  });

  describe('addPendingRequest', () => {
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
