export interface Message<T> {
  type: string;
  senderId: number;
  payload: T;
}
