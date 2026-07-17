import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { formatDate } from '../../utils/helpers';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ActivityChart from '../../components/dashboard/ActivityChart';
import StatsOverview from '../../components/dashboard/StatsOverview';

function statusVariant(post) {
  if (post.isDraft) return 'draft';
  return post.isPublic ? 'public' : 'private';
}

// All of the logged-in user's posts, in every status (public, private, draft).
export default function PostsDashboard() {
  const { currentUser } = useAuth();
  const {
    getUserPosts,
    getLikesForPost,
    getCommentsForPost,
    deletePost,
    toggleVisibility,
    publishPost,
  } = usePosts();

  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const posts = getUserPosts(currentUser.id);
  const postPendingDelete = posts.find((p) => p.id === pendingDeleteId) || null;

  function confirmDelete() {
    if (pendingDeleteId) deletePost(pendingDeleteId);
    setPendingDeleteId(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Posts</h1>
        <Link to="/dashboard/create">
          <Button variant="primary" size="sm">Create Post</Button>
        </Link>
      </div>

      <StatsOverview
        posts={posts}
        getLikesForPost={getLikesForPost}
        getCommentsForPost={getCommentsForPost}
      />

      <ActivityChart
        posts={posts}
        getLikesForPost={getLikesForPost}
        getCommentsForPost={getCommentsForPost}
      />

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500 dark:border-slate-700">
          You haven&apos;t created any posts yet. Create your first post!
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const likeCount = getLikesForPost(post.id).length;
            const commentCount = getCommentsForPost(post.id).length;

            return (
              <div
                key={post.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={statusVariant(post)} />
                      <span className="text-xs text-slate-400">{formatDate(post.createdAt)}</span>
                    </div>
                    <p className="truncate text-sm text-slate-700 dark:text-slate-300">
                      {post.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      ❤️ {likeCount} · 💬 {commentCount}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 flex-wrap gap-2">
                    {post.isDraft && (
                      <Button variant="primary" size="sm" onClick={() => publishPost(post.id)}>
                        Publish
                      </Button>
                    )}
                    {!post.isDraft && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleVisibility(post.id)}
                      >
                        Make {post.isPublic ? 'Private' : 'Public'}
                      </Button>
                    )}
                    <Link to={`/dashboard/edit/${post.id}`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setPendingDeleteId(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!postPendingDelete}
        onClose={() => setPendingDeleteId(null)}
        title="Delete this post?"
      >
        <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">
          This will permanently delete the post along with its likes and comments. This can&apos;t
          be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
