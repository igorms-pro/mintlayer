import React from 'react';

const buttonVariants = {
  variant: {
    primary: 'bg-black-primary text-white hover:bg-gray-800 active:bg-gray-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.09)]',
    secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white active:bg-gray-800',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base h-9',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-4 py-2.5 text-base h-10',
  },
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  loading?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}

/**
 * Reusable Button component with sharp corners matching Figma design
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          rounded-none cursor-pointer
          ${buttonVariants.variant[variant]}
          ${buttonVariants.size[size]}
          ${className || ''}
        `.trim().replace(/\s+/g, ' ')}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; 