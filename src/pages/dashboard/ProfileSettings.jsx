import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { fileToBase64 } from '../../utils/helpers';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

const BIO_MAX = 150;

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser.name || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || null);
  const [coverPreview, setCoverPreview] = useState(currentUser.coverImage || null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const bio = watch('bio') || '';
  const bioCount = bio.length;
  const bioColor =
    bioCount >= BIO_MAX ? 'text-rose-500' : bioCount >= BIO_MAX - 20 ? 'text-amber-500' : 'text-slate-400';

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setAvatarPreview(base64);
  }

  async function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setCoverPreview(base64);
  }

  function handleRemoveCover() {
    setCoverPreview(null);
  }

  function onSubmit(data) {
    setSuccessMessage('');
    setSaving(true);

    updateCurrentUser({
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatar: avatarPreview,
      coverImage: coverPreview,
    });

    setSaving(false);
    setSuccessMessage('Profile updated successfully');
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 font-display text-2xl font-bold">Profile Settings</h1>

      {successMessage && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Avatar
          </span>
          <div className="flex items-center gap-4">
            <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-slate-300"
            />
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Cover Image
          </span>
          <div
            className="mb-2 h-24 w-full rounded-lg bg-gradient-to-r from-brand-400 to-indigo-400"
            style={
              coverPreview
                ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : undefined
            }
          />
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="block text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-slate-300"
            />
            {coverPreview && (
              <button
                type="button"
                onClick={handleRemoveCover}
                className="text-xs font-medium text-rose-500 hover:underline"
              >
                Remove cover
              </button>
            )}
          </div>
        </div>

        <Input
          label="Full Name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <div>
          <Input
            textarea
            rows={3}
            label="Bio"
            placeholder="Tell people a bit about yourself..."
            error={errors.bio?.message}
            {...register('bio', {
              maxLength: { value: BIO_MAX, message: `Bio cannot exceed ${BIO_MAX} characters` },
            })}
          />
          <p className={clsx('mt-1 text-right text-xs', bioColor)}>
            {bioCount} / {BIO_MAX} characters
          </p>
        </div>

        <Input
          label="Location"
          placeholder="City, Country"
          error={errors.location?.message}
          {...register('location')}
        />

        <Button type="submit" isLoading={saving} disabled={bioCount > BIO_MAX}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
