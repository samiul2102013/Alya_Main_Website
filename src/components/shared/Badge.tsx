import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function Badge({ children, icon, className }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-[#E8CFC1] bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-[#781E36] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#781E36]/40 hover:shadow-md',
        className
      )}
    >
      {icon && <span className="text-[#781E36]">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
