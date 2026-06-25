importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAAGr4kghFLYRn3DRfKaFl66SdvNmafIw4",
  authDomain: "sm-golden-resort.firebaseapp.com",
  projectId: "sm-golden-resort",
  messagingSenderId: "200819635816",
  appId: "1:200819635816:web:a1b7ba3a5c4984d0e5addd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(
    payload.notification?.title || "SM Golden Resorts 🏨",
    {
      body: payload.notification?.body || "புது Booking வந்துச்சு!",
      icon: "/logo.jpeg",
      badge: "/logo.jpeg",
    }
  );
});
