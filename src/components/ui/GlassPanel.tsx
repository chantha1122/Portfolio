import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;

  glow?: "none" | "primary" | "cyan";
};

export default function GlassPanel({
  children,
  className,
  glow = "none",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "glass rounded-[28px]",
        glow === "primary" && "glow-primary",
        glow === "cyan" && "glow-cyan",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
