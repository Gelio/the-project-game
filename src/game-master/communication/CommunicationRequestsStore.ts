import { PlayerId } from '../../common/EntityIds';

export class CommunicationRequestsStore {
  private readonly requestMap = new Map<PlayerId, Set<PlayerId>>();

  public isRequestPending(senderId: PlayerId, receiverId: PlayerId) {
    if (!this.requestMap.has(senderId)) {
      return false;
    }

    const senderPendingRequests = this.requestMap.get(senderId);

    return senderPendingRequests.has(receiverId);
  }

  public addPendingRequest(senderId: PlayerId, receiverId: PlayerId) {
    if (this.isRequestPending(senderId, receiverId)) {
      throw new Error('Request is already pending');
    }

    if (!this.requestMap.has(senderId)) {
      this.requestMap.set(senderId, new Set<PlayerId>());
    }

    this.requestMap.get(senderId).add(receiverId);
  }

  public removePendingRequest(senderId: PlayerId, receiverId: PlayerId) {
    if (!this.isRequestPending(senderId, receiverId)) {
      throw new Error('Request is not pending');
    }

    this.requestMap.get(senderId).delete(receiverId);
  }
}
