import cn from "@/utils/cn";
import { ReactNode } from "react";

export interface SubjectSearchProps {
  children: ReactNode;
  className?: string;
}

export default function SubjectSearch({ children, className }: SubjectSearchProps) {
  return (
    <div
      className={cn(`
        tw-bg-white
        tw-px-2xl
        tw-py-lg
        tw-border
        tw-border-solid
        tw-border-secondary
        tw-rounded-xl`,
        className,
      )}
    >
      {children}
    </div>
  );
}