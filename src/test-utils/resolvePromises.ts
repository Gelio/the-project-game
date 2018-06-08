export async function resolvePromises() {
  return new Promise(res => process.nextTick(res));
}
