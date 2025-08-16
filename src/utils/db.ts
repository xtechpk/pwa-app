// src/utils/db.ts
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'pwa-db';
const STORE_NAME = 'notes';

export interface Note {
  id: number;
  content: string;
  synced: boolean;
}

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db: IDBPDatabase) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('synced', 'synced');
      }
    },
  });
}

export async function addNote(note: string) {
  const db = await initDB();
  const id = await db.add(STORE_NAME, { content: note, synced: false });
  if (!navigator.onLine) {
    const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } };
    if (registration.sync) {
      await registration.sync.register('sync-notes');
    }
  } else {
    await syncNotes();
  }
  return id;
}

export async function getNotes() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function syncNotes() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const index = store.index('synced');
  const unsynced = await index.getAll();
  for (const note of unsynced) {
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ title: 'Note', body: note.content }),
        headers: { 'Content-Type': 'application/json' },
      });
      await store.put({ ...note, synced: true });
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
  await tx.done;
}