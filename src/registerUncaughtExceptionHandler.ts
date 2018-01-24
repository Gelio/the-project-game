export function registerUncaughtExceptionHandler() {
  process.on('uncaughtException', error => {
    console.error('Uncaught exception', error);
  });
}
