import { mergeProps, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  solid:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-600',
  outline:
    'border border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950',
  ghost: 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button(rawProps: ButtonProps) {
  const props = mergeProps({ variant: 'solid' as Variant, size: 'md' as Size }, rawProps);
  const [local, rest] = splitProps(props, ['variant', 'size', 'class', 'children']);

  return (
    <button
      class={`focus-visible:outline-primary-500 inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[local.variant]} ${sizeClasses[local.size]} ${local.class ?? ''}`}
      {...rest}
    >
      {local.children}
    </button>
  );
}
