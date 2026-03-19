import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * General-purpose content container with a subtle shadow and border.
 * Accepts all standard div attributes so it composes easily with
 * aria-label, role, onClick, etc.
 */
export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
