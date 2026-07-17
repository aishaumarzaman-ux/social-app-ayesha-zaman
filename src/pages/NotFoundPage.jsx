import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-sm py-20 text-center">
      <p className="font-display text-5xl font-extrabold text-brand-600">404</p>
      <p className="mt-2 text-slate-500">This page doesn&apos;t exist.</p>
      <Link to="/" className="mt-5 inline-block font-medium text-brand-600 hover:underline">
        Back to feed
      </Link>
    </div>
  );
}
