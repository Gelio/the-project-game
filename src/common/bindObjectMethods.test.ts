import { bindObjectMethods } from './bindObjectMethods';

describe('bindObjectMethods', () => {
  it('should bind given object method', () => {
    const target = {
      method() {
        // tslint:disable-next-line:no-invalid-this
        return this;
      }
    };

    const symbol = Symbol('Test symbol');
    bindObjectMethods(target, symbol);

    expect(target.method()).toBe(symbol);
  });

  it('should bind methods from different keys', () => {
    const target = {
      method1() {
        // tslint:disable-next-line:no-invalid-this
        return this;
      },
      method2() {
        // tslint:disable-next-line:no-invalid-this
        return this;
      }
    };

    const symbol = Symbol('Test symbol');
    bindObjectMethods(target, symbol);

    expect(target.method1()).toBe(symbol);
    expect(target.method2()).toBe(symbol);
  });
});
