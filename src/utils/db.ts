// src/utils/db.ts
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'pwa-db';
const NOTE_STORE = 'notes';
const USER_STORE = 'users';
const BLOG_STORE = 'blogs';

export interface Note {
  id: number;
  content: string;
  synced: boolean;
}

export interface User {
  username: string;
  password: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
}

export async function initDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db: IDBPDatabase) {
      if (!db.objectStoreNames.contains(NOTE_STORE)) {
        const store = db.createObjectStore(NOTE_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('synced', 'synced');
      }
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: 'username' });
      }
      if (!db.objectStoreNames.contains(BLOG_STORE)) {
        db.createObjectStore(BLOG_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addNote(note: string) {
  const db = await initDB();
  const id = await db.add(NOTE_STORE, { content: note, synced: false });
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
  return db.getAll(NOTE_STORE);
}

export async function syncNotes() {
  const db = await initDB();
  const tx = db.transaction(NOTE_STORE, 'readwrite');
  const store = tx.objectStore(NOTE_STORE);
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

export async function addUser(user: User) {
  const db = await initDB();
  await db.add(USER_STORE, user);
}

export async function getUser(username: string) {
  const db = await initDB();
  return db.get(USER_STORE, username);
}

export async function addBlog(blog: Omit<Blog, 'id'>) {
  const db = await initDB();
  return db.add(BLOG_STORE, blog);
}

export async function getBlogs() {
  const db = await initDB();
  return db.getAll(BLOG_STORE);
}

export async function getBlog(id: number) {
  const db = await initDB();
  return db.get(BLOG_STORE, id);
}