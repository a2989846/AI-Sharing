import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          {
            'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50': variant === 'secondary',
            'border border-gray-300 bg-transparent hover:bg-gray-50 disabled:bg-gray-50': variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          'disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';