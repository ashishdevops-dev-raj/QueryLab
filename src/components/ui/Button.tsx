import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-container shadow-sm",
        secondary: "bg-surface-container text-on-surface hover:bg-surface-container-high shadow-sm",
        ghost: "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
        outline: "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container",
        success: "bg-secondary text-on-secondary hover:opacity-90 shadow-sm",
        danger: "bg-error text-on-error hover:opacity-90",
      },
      size: {
        sm: "h-7 px-2 text-body-sm",
        md: "h-8 px-3 text-body-sm",
        lg: "h-9 px-4 text-body-md",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);

Button.displayName = "Button";
