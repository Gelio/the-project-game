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
  // TODO: enable hooking up a custom exit handler (the `destoy` method of GM)
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  return screen;
}
