import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { environment } from './environments/environment';

const firebaseApp = initializeApp(environment.firebase);
const messaging = getMessaging(firebaseApp);

async function initFirebaseMessaging() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notificações não permitidas');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging, {
      vapidKey: environment.firebaseVapidKey,
      serviceWorkerRegistration: registration
    });
    console.log('FCM token', token);
    // enviar token para seu backend
  } catch (error) {
    console.error('Erro init FCM', error);
  }
}

initFirebaseMessaging();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));