// src/App.tsx
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import InstallButton from "./components/InstallButton";
import Notifications from "./components/Notifications";
import OfflineIndicator from "./components/OfflineIndicator";
import Notes from "./components/Notes";
import Login from './components/Login';
import Signup from './components/Signup';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import BlogDetail from './components/BlogDetail';
import { initDB } from './utils/db';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    initDB();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      document.documentElement.style.setProperty('--theme-color', mediaQuery.matches ? '#1a1a1a' : '#000000');
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <OfflineIndicator />
      {/* Navbar */}
      <nav className="bg-white shadow-lg p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-2xl text-gray-600 hover:text-blue-600 transition-all"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Blog PWA</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/blogs" className="sidebar-link">Blogs</Link>
          {user && <Link to="/new-blog" className="sidebar-link">New Blog</Link>}
          <Link to="/notes" className="sidebar-link">Notes</Link>
          {!user && <Link to="/login" className="sidebar-link">Login</Link>}
          {!user && <Link to="/signup" className="sidebar-link">Signup</Link>}
          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          )}
        </div>
        {user && (
          <button
            onClick={logout}
            className="md:hidden px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform z-40`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl text-gray-600 hover:text-blue-600"
          >
            ×
          </button>
        </div>
        <ul className="p-4 space-y-4">
          <li>
            <Link
              to="/blogs"
              onClick={() => setIsSidebarOpen(false)}
              className="sidebar-link"
            >
              Blogs
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/new-blog"
                onClick={() => setIsSidebarOpen(false)}
                className="sidebar-link"
              >
                New Blog
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/notes"
              onClick={() => setIsSidebarOpen(false)}
              className="sidebar-link"
            >
              Notes
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="sidebar-link"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={() => setIsSidebarOpen(false)}
                  className="sidebar-link"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<BlogList user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/blogs" element={<BlogList user={user} />} />
          <Route path="/new-blog" element={user ? <BlogForm user={user} /> : <Login setUser={setUser} />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </div>

      <Notifications />
      <InstallButton />
    </div>
  );
}