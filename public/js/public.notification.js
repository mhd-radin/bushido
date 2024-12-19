// Import Firebase SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getMessaging,
  onMessage,
  getToken,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = config.firebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Register the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../public/js/firebase-messaging-sw.js", {
        type: 'module'
    })
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);

      // Request permission to receive notifications
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Get the token for the current user
          getToken(messaging, { vapidKey: config.ENC_KEY })
            .then((currentToken) => {
              if (currentToken) {
                // Send the token to your server and update the UI if necessary
                console.log("Token:", currentToken);
              } else {
                // Show permission request UI
                console.log(
                  "No registration token available. Request permission to generate one."
                );
              }
            })
            .catch((err) => {
              console.log("An error occurred while retrieving token. ", err);
            });

          // Listen for messages
          onMessage(messaging, (payload) => {
            console.log("Message received. ", payload);
          });
        } else {
          console.log("Notification permission denied.");
        }
      });
    })
    .catch((error) => {
      console.log("Service Worker registration failed:", error);
    });
}
