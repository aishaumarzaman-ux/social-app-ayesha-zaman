import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { fileToBase64 } from '../../utils/helpers';

const MAX_CHARS = 500;

// Shared by CreatePost and EditPost. Calls onSubmit({description, image, isPublic, isDraft}).
export default function PostForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: defaultValues?.description || '',
      isPublic: defaultValues?.isPublic ?? true,
    },
  });

  const [imagePreview, setImagePreview] = useState(defaultValues?.image || null);
  const description = watch('description') || '';
  const isPublic = watch('isPublic');
  const charCount = description.length;

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
  }

  function removeImage() {
    setImagePreview(null);
  }

  function submitWith(isDraft) {
    return handleSubmit((data) => {
      onSubmit({
        description: data.description,
        image: imagePreview,
        isPublic: !!data.isPublic,
        isDraft,
      });
    });
  }

  const counterColor =
    charCount >= 480 ? 'text-rose-500' : charCount >= 400 ? 'text-amber-500' : 'text-slate-400';

  return (
    <form className="space-y-5">
      <div>
        <Input
          textarea
          rows={5}
          label="What's on your mind?"
          placeholder="Share something..."
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: MAX_CHARS, message: `Description cannot exceed ${MAX_CHARS} characters` },
          })}
        />
        {/* Bonus add-on: live character counter */}
        <p className={clsx('mt-1 text-right text-xs', counterColor)}>
          {charCount} / {MAX_CHARS} characters
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-slate-300"
        />

        {/* Bonus add-on: image preview before upload */}
        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Visibility
        </span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="radio"
              value="true"
              checked={isPublic === true}
              onChange={() => setValue('isPublic', true)}
            />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="radio"
              value="false"
              checked={isPublic === false}
              onChange={() => setValue('isPublic', false)}
            />
            Private
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          isLoading={submitting === 'draft'}
          disabled={charCount > MAX_CHARS}
          onClick={submitWith(true)}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          isLoading={submitting === 'publish'}
          disabled={charCount > MAX_CHARS}
          onClick={submitWith(false)}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}
