import { registerRootComponent } from 'expo';
import './src/task'; // defines the background task before the app loads
import { log } from './src/store';
import App from './App';

// Records JS crashes in the on-device log (shown on the Share screen)
const EU = (globalThis as any).ErrorUtils;
const prev = EU?.getGlobalHandler?.();
EU?.setGlobalHandler?.((e: any, fatal?: boolean) => {
  log(`JS ${fatal ? 'FATAL ' : ''}${e?.message ?? e}`).finally(() => prev?.(e, fatal));
});

registerRootComponent(App);
