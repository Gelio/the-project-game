import { Message } from '../interfaces/Message';

export type SendMessageFn = (message: Message<any>) => void;
