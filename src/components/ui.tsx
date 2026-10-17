'use client';

import React from 'react';
import { clsx } from 'clsx';

export const Panel: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <section className={clsx('rounded-2xl border border-line bg-surface', className)}>{children}</section>
);

export const PanelHeader: React.FC<{ title: string; hint?: string; action?: React.ReactNode }> = ({
  title,
  hint,
  action,
}) => (
  <div className="flex items-start justify-between gap-3 px-5 pt-5">
    <div>
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
    {action}
  </div>
);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' }
> = ({ variant = 'secondary', size = 'md', className, ...props }) => (
  <button
    {...props}
    className={clsx(
      'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40',
      size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
      variant === 'primary' && 'bg-accent text-black hover:bg-accent-hover',
      variant === 'secondary' && 'border border-line bg-raised text-fg hover:border-line-strong',
      variant === 'ghost' && 'text-muted hover:bg-raised hover:text-fg',
      variant === 'danger' && 'text-muted hover:bg-red-500/10 hover:text-red-400',
      className
    )}
  />
);

export const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={clsx(
      'relative h-5 w-9 shrink-0 rounded-full transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
      checked ? 'bg-accent' : 'bg-line-strong'
    )}
  >
    <span
      className={clsx(
        'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-[18px]' : 'translate-x-0.5'
      )}
    />
  </button>
);

export const Segmented = <T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="inline-flex flex-wrap gap-1 rounded-lg border border-line bg-base p-1">
    {options.map((o) => (
      <button
        key={String(o.value)}
        type="button"
        onClick={() => onChange(o.value)}
        className={clsx(
          'h-7 rounded-md px-2.5 text-xs font-medium transition-colors',
          value === o.value ? 'bg-raised text-fg shadow-sm ring-1 ring-line-strong' : 'text-muted hover:text-fg'
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);
