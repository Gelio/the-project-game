import { EventEmitter } from 'events';

type EventListener = (...args: any[]) => void;

export class CustomEventEmitter {
  protected eventEmitter = new EventEmitter();

  public once(event: string | symbol, listener: EventListener) {
    this.eventEmitter.once(event, listener);
  }

  public on(event: string | symbol, listener: EventListener) {
    this.eventEmitter.on(event, listener);
  }

  public removeListener(event: string | symbol, listener: EventListener) {
    this.eventEmitter.removeListener(event, listener);
  }

  public removeAllListeners(event?: string | symbol) {
    this.eventEmitter.removeAllListeners(event);
  }

  public emit(event: string | symbol, ...args: any[]): boolean {
    return this.eventEmitter.emit(event, args);
  }
}
