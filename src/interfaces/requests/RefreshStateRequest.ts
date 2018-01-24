import { Message } from '../Message';

export interface RefreshStateRequest extends Message<undefined> {
  type: 'REFRESH_STATE_REQUEST';
}
