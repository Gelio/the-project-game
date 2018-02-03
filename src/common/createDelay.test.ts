import { createDelay } from './createDelay';

describe('createDelay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should resolve after given delay', done => {
    const delay = 5000;
    let resolved = false;
    createDelay(delay).then(() => (resolved = true));

    expect.assertions(2);

    jest.advanceTimersByTime(4999);
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(2);

    // Use real timers to execute the Promise handler above asynchronously
    jest.useRealTimers();
    setTimeout(() => {
      expect(resolved).toBe(true);
      done();
    }, 0);
  });
});
