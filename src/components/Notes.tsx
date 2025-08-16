// src/components/Notes.tsx
import { useEffect, useState } from 'react';
import { addNote, getNotes, syncNotes } from '../utils/db';
import type { Note } from '../utils/db';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const loaded = await getNotes();
    setNotes(loaded);
    const unsynced = loaded.filter(n => !n.synced).length;
    if ('setAppBadge' in navigator && unsynced > 0 && navigator.setAppBadge) {
      navigator.setAppBadge(unsynced);
    } else if (unsynced === 0 && 'clearAppBadge' in navigator && navigator.clearAppBadge) {
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
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Notes (Offline-Sync Enabled)</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a note..."
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Save
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="p-3 bg-gray-50 rounded-lg text-gray-800 flex justify-between">
            <span>{note.content}</span>
            <span className="text-sm text-gray-500">{note.synced ? '(Synced)' : '(Pending)'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}