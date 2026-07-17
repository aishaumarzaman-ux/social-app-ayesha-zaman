import { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/post/PostCard';

// Public home. Shows all published public posts, newest first.
// Bonus add-on: local search filters by description as you type.
export default function FeedPage() {
  const { getPublicPosts } = usePosts();
  const [query, setQuery] = useState('');

  const posts = getPublicPosts();
  const filtered = query.trim()
    ? posts.filter((p) => p.description.toLowerCase().includes(query.trim().toLowerCase()))
    : posts;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 font-display text-2xl font-bold">Feed</h1>

      {/* Bonus add-on: search posts */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="mb-5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800"
      />

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500 dark:border-slate-700">
          No posts yet — be the first to share!
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500 dark:border-slate-700">
          No results found for &quot;{query}&quot;
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
