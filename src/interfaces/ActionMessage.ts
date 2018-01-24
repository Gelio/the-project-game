import { ActionInvalidMessage } from './messages/ActionInvalidMessage';
import { ActionValidMessage } from './messages/ActionValidMessage';

export type ActionMessage = ActionValidMessage | ActionInvalidMessage;
