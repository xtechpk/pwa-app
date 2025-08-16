// src/components/Notifications.tsx
import { useState } from 'react';

export default function Notifications() {
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY_HERE'
    });
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(sub),
      headers: { 'Content-Type': 'application/json' }
    });
    setSubscribed(true);
  };

  return (
    <button
      onClick={subscribe}
      disabled={subscribed}
      className="fixed bottom-16 right-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all"
    >
      {subscribed ? 'Subscribed' : 'Enable Notifications'}
    </button>
  );
}