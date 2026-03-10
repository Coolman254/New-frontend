import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

export interface FloatingActionButtonProps extends ButtonProps {
  position?: "bottom-right" | "bottom-center" | "bottom-left";
}

const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, position = "bottom-right", children, ...props }, ref) => {
    const positionClasses = {
      "bottom-right": "right-4 bottom-20 md:bottom-6",
      "bottom-center": "left-1/2 -translate-x-1/2 bottom-20 md:bottom-6",
      "bottom-left": "left-4 bottom-20 md:bottom-6",
    };

    return (
      <Button
        ref={ref}
        size="lg"
        className={cn(
          "fixed z-40 h-14 w-14 rounded-full shadow-lg gradient-accent text-accent-foreground hover:opacity-90 min-h-[56px] min-w-[56px]",
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton };
