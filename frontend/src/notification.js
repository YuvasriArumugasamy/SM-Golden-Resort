// Browser Push Notifications — Native Web API only (no Firebase dependency)

export async function requestPermission() {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;
  const permission = await Notification.requestPermission();
  return permission;
}

export function showNotification(title, body, icon = "/WhatsApp Image 2026-06-22 at 18.04.13.jpeg") {
  if (typeof window === "undefined") return;
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon });
}

export function listenForegroundMessages() {
  // No-op: no FCM needed
}
