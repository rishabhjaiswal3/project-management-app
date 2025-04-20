import { cn } from "@/lib/utils";
import React from "react";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "destructive" }) {
  const baseStyles = "px-4 py-2 rounded font-medium text-white transition";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700",
    destructive: "bg-red-600 hover:bg-red-700",
  };
  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}
