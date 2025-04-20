import { cn } from "@/lib/utils";
import React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("border px-3 py-2 rounded w-full", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
