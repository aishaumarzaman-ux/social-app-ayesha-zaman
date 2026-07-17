import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { seedDemoData } from '../utils/demoData';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const bannerMessage = location.state?.message;

  function onSubmit({ email, password }) {
    setFormError('');
    setSubmitting(true);
    try {
      login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  }

  // Optional, for demos/recordings only — seeds a few sample users + posts
  // with real photos via the normal storage.js functions, then logs in as
  // one of them. Doesn't touch the real signup/login flow at all.
  function handleTryDemo() {
    setFormError('');
    const demoUser = seedDemoData();
    try {
      login(demoUser.email, 'Demo1234');
      navigate('/');
    } catch (err) {
      setFormError('Could not load demo data.');
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 font-display text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500">Log in to continue to SocialApp.</p>

      {bannerMessage && (
        <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          {bannerMessage}
        </div>
      )}

      {formError && (
        <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />
        <Button type="submit" className="w-full" isLoading={submitting}>
          Log in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>

      <div className="mt-6 border-t border-slate-200 pt-4 text-center dark:border-slate-800">
        <button
          type="button"
          onClick={handleTryDemo}
          className="text-xs font-medium text-slate-400 hover:text-brand-600 hover:underline"
        >
          Just browsing? Load demo data →
        </button>
      </div>
    </div>
  );
}
