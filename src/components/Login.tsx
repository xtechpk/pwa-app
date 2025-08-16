// src/components/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/db';

export default function Login({ setUser }: { setUser: (user: { username: string }) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await getUser(username);
    if (user && user.password === password) {
      localStorage.setItem('user', JSON.stringify({ username }));
      setUser({ username });
      navigate('/blogs');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
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
        onClick={handleLogin}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Login
      </button>
    </div>
  );
}