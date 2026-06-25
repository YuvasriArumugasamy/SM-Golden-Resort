// Browser Push Notifications — Native Web API only (no Firebase messaging)
// FCM token saving to Firestore still works via firebase/firestore

/* ── Request browser notification permission ── */
export async function requestPermission() {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    // Save a record to Firestore that notifications are enabled
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
    const { db } = await import("./firebase-config");

    await addDoc(collection(db, "notification_devices"), {
      device: navigator.userAgent,
      enabledAt: serverTimestamp(),
      url: window.location.origin,
    });
  } catch (err) {
    console.warn("Firestore save skipped:", err?.message);
  }

  return "granted";
}

/* ── Show a local browser notification ── */
export function showNotification(title, body, icon = "/logo.jpeg") {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon });
}

/* ── Placeholder for foreground messages (no FCM needed) ── */
export function listenForegroundMessages() {
  // No-op: browser native notifications are shown via showNotification()
}
