import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getMessaging,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_y27g51gE8HwwypZsRExzK8f0HsvEZ6U",
  authDomain: "bushido-2024.firebaseapp.com",
  projectId: "bushido-2024",
  storageBucket: "bushido-2024.appspot.com",
  messagingSenderId: "791522022722",
  appId: "1:791522022722:web:7ad2409049a3e9703a24db",
  measurementId: "G-PLQBR46HXP",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
