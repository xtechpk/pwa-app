// src/components/Signup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, getUser } from '../utils/db';

export default function Signup({ setUser }: { setUser: (user: { username: string }) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    const existing = await getUser(username);
    if (existing) {
      alert('User exists');
      return;
    }
    await addUser({ username, password });
    localStorage.setItem('user', JSON.stringify({ username }));
    setUser({ username });
    navigate('/blogs');
  };

  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Signup</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-3 mb-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSignup}
        className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
      >
        Signup
      </button>
    </div>
  );
}