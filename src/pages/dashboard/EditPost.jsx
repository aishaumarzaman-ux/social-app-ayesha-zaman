import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import PostForm from '../../components/post/PostForm';

export default function EditPost() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { getPostById, updatePost } = usePosts();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(null); // 'draft' | 'publish' | null
  const [draftMessage, setDraftMessage] = useState('');

  const post = getPostById(postId);

  // Post doesn't exist, or belongs to someone else — bounce back to the list.
  if (!post || post.authorId !== currentUser.id) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  function handleSubmit({ description, image, isPublic, isDraft }) {
    setDraftMessage('');
    setSubmitting(isDraft ? 'draft' : 'publish');

    updatePost(postId, { description, image, isPublic, isDraft });

    setSubmitting(null);

    if (isDraft) {
      setDraftMessage('Post saved as draft');
    } else {
      navigate('/');
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 font-display text-2xl font-bold">Edit Post</h1>

      {draftMessage && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {draftMessage}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <PostForm defaultValues={post} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
