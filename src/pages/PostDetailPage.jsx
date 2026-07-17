import { Link, useNavigate, useParams } from 'react-router-dom';
import { storage } from '../utils/storage';
import { formatFullDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import Avatar from '../components/ui/Avatar';
import PostActions from '../components/post/PostActions';
import CommentSection from '../components/post/CommentSection';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getPostById, getLikesForPost, getCommentsForPost, isLikedByUser, toggleLike } = usePosts();

  const post = getPostById(postId);

  if (!post) {
    return (
      <div className="mx-auto max-w-xl text-center py-16">
        <p className="text-slate-500">This post doesn&apos;t exist or was removed.</p>
        <Link to="/" className="mt-3 inline-block text-brand-600 hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const author = storage.getUsers().find((u) => u.id === post.authorId);
  const likeCount = getLikesForPost(post.id).length;
  const commentCount = getCommentsForPost(post.id).length;
  const liked = isLikedByUser(post.id, currentUser?.id);

  function handleLike() {
    toggleLike(post.id, currentUser.id);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate(`/profile/${author?.id}`)}>
            <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="md" />
          </button>
          <div>
            <button
              onClick={() => navigate(`/profile/${author?.id}`)}
              className="font-medium text-slate-900 hover:underline dark:text-slate-100"
            >
              {author?.name || 'Unknown user'}
            </button>
            <p className="text-xs text-slate-400">{formatFullDate(post.createdAt)}</p>
          </div>
        </div>

        {post.description && (
          <p className="mb-4 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
            {post.description}
          </p>
        )}

        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="mb-4 w-full rounded-lg object-cover"
          />
        )}

        <PostActions
          likeCount={likeCount}
          commentCount={commentCount}
          isLiked={liked}
          onLike={handleLike}
        />

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
