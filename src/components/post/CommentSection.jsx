import { useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import Avatar from '../ui/Avatar';

// Accepts a postId, reads comments filtered by that post, and handles add/delete.
// Used on the Post Detail page.
export default function CommentSection({ postId }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { getCommentsForPost, addComment, deleteComment } = usePosts();
  const [text, setText] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const comments = getCommentsForPost(postId);
  const users = storage.getUsers();

  function getAuthor(authorId) {
    return users.find((u) => u.id === authorId);
  }

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(postId, currentUser.id, trimmed);
    setText('');
  }

  function handleDelete(commentId) {
    deleteComment(commentId);
    setConfirmingId(null);
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleAdd} className="mb-5 flex items-start gap-3">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <button
              type="submit"
              className="mt-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
            >
              Comment
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-5 text-sm text-slate-500">
          <Link to="/login" className="text-brand-600 hover:underline">
            Login
          </Link>{' '}
          to comment
        </p>
      )}

      <ul className="space-y-4">
        {comments.map((comment) => {
          const author = getAuthor(comment.authorId);
          const isOwn = currentUser?.id === comment.authorId;

          return (
            <li key={comment.id} className="flex items-start gap-3">
              <Avatar src={author?.avatar} name={author?.name || 'Unknown'} size="sm" />
              <div className="flex-1 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {author?.name || 'Unknown user'}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>

                {isOwn && (
                  <div className="mt-1">
                    {confirmingId === comment.id ? (
                      <span className="text-xs text-slate-500">
                        Are you sure?{' '}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="font-medium text-rose-600 hover:underline"
                        >
                          Yes
                        </button>{' '}
                        /{' '}
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="font-medium text-slate-600 hover:underline dark:text-slate-300"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(comment.id)}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
