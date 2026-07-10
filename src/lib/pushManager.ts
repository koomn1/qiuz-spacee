import { getApiUrl } from './origin';
import { fetchWithAuth } from './authFetch';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerPushNotifications(userId: string) {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported by this browser.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker registered with scope:', registration.scope);

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }

    const keyRes = await fetch(getApiUrl('/api/notifications/vapid-public-key'));
    if (!keyRes.ok) {
      throw new Error('Failed to fetch VAPID public key from server');
    }
    const { publicKey } = await keyRes.json();
    if (!publicKey) {
      throw new Error('Empty VAPID public key received from server');
    }

    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    const syncRes = await fetchWithAuth(getApiUrl('/api/notifications/subscribe'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        subscription,
      }),
    });

    if (syncRes.ok) {
      console.log('Push subscription synchronized successfully with backend!');
    } else {
      console.error('Failed to synchronize push subscription with backend.');
    }
  } catch (err) {
    console.error('Error establishing Web Push notification subscription:', err);
  }
}
