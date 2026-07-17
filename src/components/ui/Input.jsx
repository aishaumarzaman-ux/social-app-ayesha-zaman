import { forwardRef } from 'react';
import clsx from 'clsx';

// forwardRef so react-hook-form's register() ref works correctly.
const Input = forwardRef(function Input(
  { label, error, type = 'text', className, textarea = false, ...rest },
  ref
) {
  const Tag = textarea ? 'textarea' : 'input';

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <Tag
        ref={ref}
        type={textarea ? undefined : type}
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500',
          'dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
          error
            ? 'border-rose-400 focus:ring-rose-400'
            : 'border-slate-300 dark:border-slate-700',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export default Input;
