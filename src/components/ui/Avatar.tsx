import { clsx } from 'clsx';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  /** Image URL — falls back to initials when null/undefined or on load error. */
  src?: string | null;
  /** Full name used to generate initials and the img alt text. */
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className,
}: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const initials = getInitials(name);

  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        sizeClass,
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={clsx('rounded-full object-cover', sizeClass)}
        />
      ) : (
        <span
          aria-label={name}
          className="flex h-full w-full items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
