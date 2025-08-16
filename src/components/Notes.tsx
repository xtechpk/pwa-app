// src/components/Notes.tsx
import { useEffect, useState } from 'react';
import { addNote, getNotes, syncNotes } from '../utils/db';
import type { Note } from '../utils/db';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadNotes();
    // Periodic load or listen for changes if needed
  }, []);

  const loadNotes = async () => {
    const loaded = await getNotes();
    setNotes(loaded);
    const unsynced = loaded.filter(n => !n.synced).length;
    if ('setAppBadge' in navigator && unsynced > 0) {
      navigator.setAppBadge(unsynced);
    } else if (unsynced === 0 && 'clearAppBadge' in navigator) {
      navigator.clearAppBadge();
    }
  };

  const handleAdd = async () => {
    if (!newNote) return;
    await addNote(newNote);
    setNewNote('');
    await loadNotes();
    if (navigator.onLine) {
      await syncNotes();
      await loadNotes();
    }
  };

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2">Notes (Offline-Sync Enabled)</h2>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        className="w-full p-2 border rounded text-gray-900"
        placeholder="Add a note..."
      />
      <button onClick={handleAdd} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Save Note</button>
      <ul className="mt-4">
        {notes.map((note) => (
          <li key={note.id} className="p-2 border-b">{note.content} {note.synced ? '(Synced)' : '(Pending)'}</li>
        ))}
      </ul>
    </div>
  );
}