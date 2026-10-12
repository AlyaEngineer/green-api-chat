import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost';
  size?: 'large' | 'medium' | 'icon';
};

const variantClassNames = {
  primary: 'bg-themed text-contrast hover:bg-themed-hover disabled:bg-themed-disabled',
  ghost: 'bg-transparent text-secondary hover:text-primary disabled:text-tertiary',
};

const sizeClassNames = {
  large: 'h-15 rounded-field px-6 text-lg',
  medium: 'h-10 rounded-field px-4 text-base',
  icon: 'size-10 rounded-field',
};

export function Button({
  variant = 'primary',
  size = 'medium',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors ${variantClassNames[variant]} ${sizeClassNames[size]} ${className}`}
      {...props}
    />
  );
}
