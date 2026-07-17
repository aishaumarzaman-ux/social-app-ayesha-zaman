import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';

// Renders the Like + Comment row shared by PostCard and PostDetailPage.
// Guests can see counts but get redirected to /login on click.
export default function PostActions({
  likeCount,
  commentCount,
  isLiked,
  onLike,
  onCommentClick,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLike(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    onLike();
  }

  function handleComment(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    onCommentClick?.();
  }

  return (
    <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
      <button
        onClick={handleLike}
        className={clsx(
          'flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors',
          isLiked
            ? 'text-brand-600 font-medium'
            : 'text-slate-500 hover:text-brand-600 dark:text-slate-400'
        )}
      >
        <span>{isLiked ? '❤️' : '🤍'}</span>
        <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
      </button>

      <button
        onClick={handleComment}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400"
      >
        <span>💬</span>
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>
    </div>
  );
}
