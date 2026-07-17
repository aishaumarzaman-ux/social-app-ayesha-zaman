import { Link, useParams } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';

export default function ProfilePage() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { getUserPublicPosts } = usePosts();

  const user = storage.getUsers().find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl text-center py-16">
        <p className="text-slate-500">This user doesn&apos;t exist.</p>
        <Link to="/" className="mt-3 inline-block text-brand-600 hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === user.id;
  const posts = getUserPublicPosts(user.id);

  return (
    <div className="mx-auto max-w-xl">
      <ProfileHeader user={user} isOwner={isOwner} />

      <h2 className="mb-3 mt-6 font-display text-lg font-semibold">Posts</h2>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500 dark:border-slate-700">
          No public posts yet
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
