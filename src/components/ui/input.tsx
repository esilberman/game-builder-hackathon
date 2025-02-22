import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-sm',
        lg: 'text-lg',
        default: 'text-sm',
      },
      bg: {
        filled: 'bg-background',
        outlined: 'bg-transparent',
        default: 'bg-transparent',
      },
    },
    defaultVariants: {
      size: 'sm',
      bg: 'outlined',
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & VariantProps<typeof inputVariants>>(
  ({ className, size, type, bg, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(inputVariants({ size, bg }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
