import { UITransport } from './UITransport';

describe('UITransport', () => {
  it('should call constructor function when logging', () => {
    const logFunction = jest.fn();
    const uiTransport = new UITransport(logFunction);

    uiTransport.log({
      level: 'info',
      message: 'foo',
      timestamp: '2018-02-03T13:50:32.405Z'
    });

    expect(logFunction).toHaveBeenCalledTimes(1);
    expect(logFunction).toHaveBeenCalledWith(expect.any(String));
  });

  it('should call callback function when logging', () => {
    const logFunction = jest.fn();
    const afterLogCallback = jest.fn();
    const uiTransport = new UITransport(logFunction);

    uiTransport.log(
      {
        level: 'info',
        message: 'foo',
        timestamp: '2018-02-03T13:50:32.405Z'
      },
      afterLogCallback
    );

    expect(afterLogCallback).toHaveBeenCalledTimes(1);
  });
});
