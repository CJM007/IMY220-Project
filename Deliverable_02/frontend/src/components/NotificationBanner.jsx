import { useState } from "react";
import { markNotificationRead } from "../api.js";

// Bonus: alerts for users whose posts/albums have been removed by an admin.
export default function NotificationBanner({ notifications, onDismiss }) {
  const [dismissing, setDismissing] = useState(null);
  const unread = (notifications || []).filter((n) => !n.read);
  if (unread.length === 0) return null;

  async function dismiss(id) {
    setDismissing(id);
    try {
      await markNotificationRead(id);
      onDismiss?.(id);
    } finally {
      setDismissing(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-3 space-y-2">
      {unread.map((n) => (
        <div
          key={n._id}
          className="flex items-start justify-between gap-3 rounded-lg border border-gold bg-gold/10 px-4 py-2 text-sm"
        >
          <span>{n.message}</span>
          <button
            onClick={() => dismiss(n._id)}
            disabled={dismissing === n._id}
            className="text-inksoft dark:text-inksoftdark hover:text-rust shrink-0"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
