import { messaging, db } from "./firebase-config";
import { getToken, onMessage } from "firebase/messaging";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

const VAPID_KEY = "BB_p2fHDHA9BQdHB63px2TGGqzlS9OygTax1a7TCCwZjs-T0vx73qzmjQ5h-kZowpRp6EiYkr8FSzr6RD7cUHo";

/* ── Request Permission + Get FCM Token ── */
export async function requestPermission() {
  if (!("Notification" in window)) {
    console.warn("Browser doesn't support notifications");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission:", permission);
    return null;
  }

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log("FCM Token:", token);
      // Save token to Firestore
      await addDoc(collection(db, "fcm_tokens"), {
        token,
        device: navigator.userAgent,
        createdAt: serverTimestamp(),
      });
      return token;
    }
  } catch (err) {
    console.error("Failed to get FCM token:", err);
  }
  return null;
}

/* ── Listen for foreground messages ── */
export function listenForegroundMessages() {
  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    const title = payload.notification?.title || "SM Golden Resorts 🏨";
    const body  = payload.notification?.body  || "புது Booking வந்துச்சு!";

    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/logo.jpeg" });
    }
  });
}

/* ── Listen for new bookings in Firestore ── */
export function listenForNewBookings(onNewBooking) {
  let isFirst = true;
  return onSnapshot(collection(db, "bookings"), (snapshot) => {
    if (isFirst) { isFirst = false; return; } // skip initial load
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const booking = change.doc.data();
        const name = booking.guestName || booking.name || "Guest";
        const date = booking.checkIn
          ? new Date(booking.checkIn).toLocaleDateString("en-IN")
          : "N/A";

        if (Notification.permission === "granted") {
          new Notification("புது Booking வந்துச்சு! 🎉", {
            body: `பேரு: ${name} | தேதி: ${date}`,
            icon: "/logo.jpeg",
          });
        }
        if (onNewBooking) onNewBooking(booking);
      }
    });
  });
}
