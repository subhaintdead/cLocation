import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { enqueue, flush, Pt } from './store';

export const TASK = 'clocation-share';

TaskManager.defineTask(TASK, async ({ data, error }: any) => {
  if (error || !data?.locations) return;
  const pts: Pt[] = (data.locations as Location.LocationObject[]).map((l) => ({
    lat: l.coords.latitude,
    lng: l.coords.longitude,
    t: l.timestamp,
    spd: l.coords.speed ?? undefined,
    hdg: l.coords.heading ?? undefined,
  }));
  await enqueue(pts);
  await flush();
});

export async function startSharing() {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') throw new Error('Location permission is needed');
  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== 'granted') throw new Error('Set location to "Allow all the time"');
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
}

export async function stopSharing() {
  if (await Location.hasStartedLocationUpdatesAsync(TASK)) {
    await Location.stopLocationUpdatesAsync(TASK);
  }
}
