// src/components/OfflineIndicator.tsx
import { useEffect, useState } from 'react';
import { syncNotes } from '../utils/db';

export default function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', () => syncNotes().catch(console.error));
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', () => syncNotes().catch(console.error));
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center shadow-lg z-50">
      Offline - Changes will sync when online
    </div>
  );
}