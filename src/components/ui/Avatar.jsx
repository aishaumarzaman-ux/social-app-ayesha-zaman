import clsx from 'clsx';
import { getInitial } from '../../utils/helpers';

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-base',
  lg: 'h-20 w-20 text-2xl',
};

const PALETTE = [
  'bg-brand-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-violet-500', 'bg-cyan-500',
];

function colorFromName(name = '') {
  const code = name.charCodeAt(0) || 0;
  return PALETTE[code % PALETTE.length];
}

export default function Avatar({ src, name = '', size = 'md', className }) {
  const sizeClass = SIZES[size] || SIZES.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={clsx('rounded-full object-cover flex-shrink-0', sizeClass, className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizeClass,
        colorFromName(name),
        className
      )}
    >
      {getInitial(name)}
    </div>
  );
}
