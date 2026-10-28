import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header.jsx";
import NotificationBanner from "./NotificationBanner.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, setUser } = useAuth();
  const [localNotifs, setLocalNotifs] = useState(null);

  const notifications = localNotifs ?? user?.notifications ?? [];

  function handleDismiss(id) {
    const updated = notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
    setLocalNotifs(updated);
    setUser((u) => (u ? { ...u, notifications: updated } : u));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {user && <NotificationBanner notifications={notifications} onDismiss={handleDismiss} />}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-inksoft dark:text-inksoftdark py-4">
        Dog-Eared &mdash; a cozy corner for book lovers.
      </footer>
    </div>
  );
}
