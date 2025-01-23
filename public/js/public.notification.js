// Import Firebase SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getMessaging,
  onMessage,
  getToken,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js";



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
      
      // Request permission to receive notifications
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Get the token for the current user
          getToken(messaging, { vapidKey: config.FCM_KEY, serviceWorkerRegistration: registration })
            .then((currentToken) => {
              if (currentToken) {
                // Send the token to your server and update the UI if necessary
                navigator.clipboard.writeText(currentToken);
                
              } else {
                // Show permission request UI
                
              }
            })
            .catch((err) => {
            });

          // Listen for messages
          onMessage(messaging, (payload) => {
          });
        } else {
        }
      });
    })
    .catch((error) => {
    });
}
