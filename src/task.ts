import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enqueue, flush, K, log, Pt } from './store';

export const TASK = 'clocation-share';

TaskManager.defineTask(TASK, async ({ data, error }: any) => {
  if (error) { await log(`task error: ${error.message ?? error}`); return; }
  if (!data?.locations) return;
  const pts: Pt[] = (data.locations as Location.LocationObject[]).map((l) => ({
    lat: l.coords.latitude,
    lng: l.coords.longitude,
    t: l.timestamp,
    spd: l.coords.speed ?? undefined,
    hdg: l.coords.heading ?? undefined,
  }));
  await log(`got ${pts.length} fix`);
  await enqueue(pts);
  await flush();
});

// Android refuses to start a foreground service while the app is in the background
// (the background-permission screen leaves the app there for a moment).
const waitActive = () =>
  AppState.currentState === 'active'
    ? Promise.resolve()
    : new Promise<void>((res) => {
        const sub = AppState.addEventListener('change', (st) => {
          if (st === 'active') { sub.remove(); setTimeout(res, 600); }
        });
      });

export async function startSharing() {
  await log('ask foreground perm');
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') throw new Error('Location permission is needed');
  await log('ask background perm');
  const bg = await Location.requestBackgroundPermissionsAsync();
  await log(`background perm: ${bg.status}`);
  if (bg.status !== 'granted') throw new Error('Set location to "Allow all the time"');
  await waitActive();
  await log('starting service');
  await Location.stopLocationUpdatesAsync(TASK).catch(() => {}); // clear any stale registration
  await Location.startLocationUpdatesAsync(TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 10,
    foregroundService: {
      notificationTitle: 'cLocation',
      notificationBody: 'Sharing location',
      notificationColor: '#2563eb',
    },
  });
  await AsyncStorage.setItem(K.sharing, '1');
  await log('service started');
}

export async function stopSharing() {
  await AsyncStorage.setItem(K.sharing, '0');
  if (await Location.hasStartedLocationUpdatesAsync(TASK).catch(() => false)) {
    await Location.stopLocationUpdatesAsync(TASK).catch(() => {});
  }
}

/** Call on launch. Stops a service left over from a crashed run; returns true if sharing is genuinely on. */
export async function reconcile(): Promise<boolean> {
  const running = await Location.hasStartedLocationUpdatesAsync(TASK).catch(() => false);
  const wanted = (await AsyncStorage.getItem(K.sharing)) === '1';
  if (running && !wanted) {
    await log('stale service found: stopping');
    await stopSharing();
    return false;
  }
  return running && wanted;
}
