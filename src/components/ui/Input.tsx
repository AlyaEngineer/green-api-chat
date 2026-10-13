import type { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1 text-left">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-10 w-full rounded-field bg-field px-4 text-base outline-none placeholder:text-tertiary autofill:shadow-[inset_0_0_0_1000px_#e6edf5] autofill:[-webkit-text-fill-color:var(--color-primary)] focus:ring-2 focus:ring-themed aria-invalid:ring-2 aria-invalid:ring-negative ${className}`}
        {...props}
      />
      <p id={errorId} className="min-h-4 px-1 text-xs text-negative">
        {error}
      </p>
    </div>
  );
}
