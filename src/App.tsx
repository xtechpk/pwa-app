// src/App.tsx
import { useEffect } from 'react';
import InstallButton from "./components/InstallButton";
import Notifications from "./components/Notifications";
import OfflineIndicator from "./components/OfflineIndicator";
import Notes from "./components/Notes";
import { initDB } from './utils/db';

export default function App() {
  useEffect(() => {
    initDB();
    // Dark mode detection for theme (update meta if possible, or use CSS)
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      document.documentElement.style.setProperty('--theme-color', mediaQuery.matches ? '#1a1a1a' : '#000000');
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center p-6">
      <OfflineIndicator />
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">🚀 My Advanced React + TypeScript PWA</h1>
      <p className="text-lg max-w-lg mb-6">
        Now with push notifications, offline sync, badging, and more!
      </p>
      <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-md mb-6">
        <p className="text-base leading-relaxed">
          ✅ Installable & offline-ready.<br />🔔 Push notifications & badging.<br />🔄 Background sync for data.<br />📤 Share target & file handling.
        </p>
      </div>
      <Notes />
      <Notifications />
      <InstallButton />
    </div>
  );
}