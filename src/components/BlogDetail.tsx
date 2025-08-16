// src/components/BlogDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlog } from '../utils/db';
import type { Blog } from '../utils/db';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (id) {
        const loaded = await getBlog(parseInt(id));
        setBlog(loaded);
      }
    };
    loadBlog();
  }, [id]);

  if (!blog) return <div className="max-w-2xl mx-auto p-6 text-gray-800">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{blog.title}</h2>
      <p className="text-gray-600 mb-4">By {blog.author}</p>
      <p className="text-gray-800 leading-relaxed">{blog.content}</p>
    </div>
  );
}