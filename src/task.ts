import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { enqueue, flush, log, Pt } from './store';

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
  await log('service started');
}

export async function stopSharing() {
  if (await Location.hasStartedLocationUpdatesAsync(TASK)) {
    await Location.stopLocationUpdatesAsync(TASK);
  }
}
