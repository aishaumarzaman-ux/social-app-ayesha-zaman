import clsx from 'clsx';

const VARIANTS = {
  draft: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  public: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  private: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const LABELS = {
  draft: 'Draft',
  public: 'Public',
  private: 'Private',
};

export default function Badge({ variant = 'public' }) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant]
      )}
    >
      {LABELS[variant]}
    </span>
  );
}
