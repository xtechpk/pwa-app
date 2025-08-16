// src/components/BlogList.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../utils/db';
import type { Blog } from '../utils/db';

export default function BlogList({ user }: { user: { username: string } | null }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const loaded = await getBlogs();
    setBlogs(loaded);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Blogs</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog.id}`}
            key={blog.id}
            className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
            <p className="text-gray-600">By {blog.author}</p>
          </Link>
        ))}
      </div>
      {user && (
        <Link
          to="/new-blog"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Add New Blog
        </Link>
      )}
    </div>
  );
}