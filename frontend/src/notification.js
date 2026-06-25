// Firebase messaging — browser-only, all imports are dynamic (lazy)
// This avoids Vite/Rollup build errors for server-side imports

const VAPID_KEY = "BB_p2fHDHA9BQdHB63px2TGGqzlS9OygTax1a7TCCwZjs-T0vx73qzmjQ5h-kZowpRp6EiYkr8FSzr6RD7cUHo";

/* ── Request Permission + Get FCM Token ── */
export async function requestPermission() {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const firebase = await import("./firebase-config");
    const { getToken, getMessaging } = await import("firebase/messaging");
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");

    const messaging = getMessaging(firebase.default);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (token) {
      await addDoc(collection(firebase.db, "fcm_tokens"), {
        token,
        device: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      return token;
    }
  } catch (err) {
    console.error("FCM token error:", err);
  }
  return null;
}

/* ── Listen foreground messages ── */
export async function listenForegroundMessages() {
  if (typeof window === "undefined") return;
  try {
    const firebase = await import("./firebase-config");
    const { onMessage, getMessaging } = await import("firebase/messaging");

    const messaging = getMessaging(firebase.default);
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || "SM Golden Resorts 🏨";
      const body  = payload.notification?.body  || "புது Booking வந்துச்சு!";
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/logo.jpeg" });
      }
    });
  } catch (err) {
    console.error("FCM listen error:", err);
  }
}
