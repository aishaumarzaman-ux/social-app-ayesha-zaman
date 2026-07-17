import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import PostForm from '../../components/post/PostForm';

export default function CreatePost() {
  const { currentUser } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(null); // 'draft' | 'publish' | null
  const [draftMessage, setDraftMessage] = useState('');
  const [formKey, setFormKey] = useState(0); // bump to reset PostForm after a draft save

  function handleSubmit({ description, image, isPublic, isDraft }) {
    setDraftMessage('');
    setSubmitting(isDraft ? 'draft' : 'publish');

    createPost({
      authorId: currentUser.id,
      description,
      image,
      isPublic,
      isDraft,
    });

    setSubmitting(null);

    if (isDraft) {
      setDraftMessage('Post saved as draft');
      setFormKey((k) => k + 1); // remounts PostForm with empty defaults
    } else {
      navigate('/');
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 font-display text-2xl font-bold">Create Post</h1>

      {draftMessage && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {draftMessage}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <PostForm key={formKey} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
