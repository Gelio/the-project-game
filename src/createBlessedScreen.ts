import * as blessed from 'blessed';

function isWindows() {
  return /^win/.test(process.platform);
}

export function createBlessedScreen() {
  const screenOptions: blessed.Widgets.IScreenOptions = {
    smartCSR: true,
    dockBorders: false,
    fullUnicode: true,
    autoPadding: true
  };

  if (isWindows()) {
    screenOptions.terminal = 'windows-ansi';
  }

  const screen = blessed.screen(screenOptions);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  return screen;
}
