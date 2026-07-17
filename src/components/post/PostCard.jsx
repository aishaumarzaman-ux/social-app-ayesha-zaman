import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import Avatar from '../ui/Avatar';
import PostActions from './PostActions';

// Accepts a `post` object, looks up its author, and renders the full card.
// Used on the Feed page and the Profile page.
export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const { getLikesForPost, getCommentsForPost, isLikedByUser, toggleLike } = usePosts();

  const author = storage.getUsers().find((u) => u.id === post.authorId);
  const likeCount = getLikesForPost(post.id).length;
  const commentCount = getCommentsForPost(post.id).length;
  const liked = isLikedByUser(post.id, currentUser?.id);

  // Bonus add-on: bookmark / save posts. Saved IDs live on the user object,
  // exactly as the assignment spec asks for.
  const savedIds = currentUser?.savedPostIds || [];
  const isSaved = savedIds.includes(post.id);

  function goToPost() {
    navigate(`/posts/${post.id}`);
  }

  function goToProfile(e) {
    e.stopPropagation();
    navigate(`/profile/${post.authorId}`);
  }

  function handleLike() {
    toggleLike(post.id, currentUser.id);
  }

  function handleSaveToggle(e) {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const nextSavedIds = isSaved
      ? savedIds.filter((id) => id !== post.id)
      : [...savedIds, post.id];
    updateCurrentUser({ savedPostIds: nextSavedIds });
  }

  return (
    <article
      onClick={goToPost}
      className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-card transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <button
        onClick={handleSaveToggle}
        title={isSaved ? 'Remove from saved' : 'Save post'}
        className={`absolute right-4 top-4 text-lg transition-opacity ${
          isSaved ? 'opacity-100' : 'opacity-30 hover:opacity-70'
        }`}
      >
        🔖
      </button>

      <div className="mb-3 flex items-center gap-3">
        <button onClick={goToProfile}>
          <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="md" />
        </button>
        <div>
          <button
            onClick={goToProfile}
            className="font-medium text-slate-900 hover:underline dark:text-slate-100"
          >
            {author?.name || 'Unknown user'}
          </button>
          <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {post.description && (
        <p className="mb-3 whitespace-pre-line text-sm text-slate-700 line-clamp-3 dark:text-slate-300">
          {post.description}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="Post attachment"
          className="mb-3 max-h-96 w-full rounded-lg object-cover"
        />
      )}

      <PostActions
        likeCount={likeCount}
        commentCount={commentCount}
        isLiked={liked}
        onLike={handleLike}
        onCommentClick={goToPost}
      />
    </article>
  );
}
