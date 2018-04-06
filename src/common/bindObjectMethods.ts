export function bindObjectMethods(object: { [key: string]: Function }, thisValue: Object) {
  Object.keys(object).forEach(key => {
    // @ts-ignore
    object[key] = object[key].bind(thisValue);
  });
}
