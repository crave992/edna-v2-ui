import { ReactNode } from 'react';

interface SectionProps {
  children?: ReactNode;
  noContainer?: boolean;
}

export default function Section({ children, noContainer = false }: SectionProps) {
  return (
    <div className="tw-min-h-[179px] tw-bg-secondary tw-py-[20px] tw-border-b tw-border-secondary tw-border-solid tw-border-t-0 tw-border-l-0 tw-border-r-0 ">
      <div className={`${noContainer ? '' : 'container '}`}>{children}</div>
    </div>
  );
}
