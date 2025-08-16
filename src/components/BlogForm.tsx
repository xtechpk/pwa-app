// src/components/BlogForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBlog } from '../utils/db';

export default function BlogForm({ user }: { user: { username: string } }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await addBlog({ title, content, author: user.username });
    navigate('/blogs');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">New Blog</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
        className="w-full p-3 mb-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Blog Content"
        className="w-full p-3 mb-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
      />
      <button
        onClick={handleSubmit}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Submit
      </button>
    </div>
  );
}