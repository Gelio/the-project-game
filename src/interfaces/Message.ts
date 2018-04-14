import { EntityId } from '../common/EntityIds';

export interface Message<T> {
  type: string;
  senderId: EntityId;
  payload: T;
}
