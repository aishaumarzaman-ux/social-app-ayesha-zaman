import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../../components/post/PostCard';

// Bonus add-on: Saved Posts. Reads the current user's savedPostIds and
// renders those posts using the same PostCard used on Feed/Profile.
export default function SavedPosts() {
  const { currentUser } = useAuth();
  const { posts } = usePosts();

  const savedIds = currentUser?.savedPostIds || [];
  const savedPosts = posts
    .filter((p) => savedIds.includes(p.id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
        Saved Posts
      </h1>

      {savedPosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
          You haven't saved any posts yet — tap the bookmark icon on a post to save it here.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
