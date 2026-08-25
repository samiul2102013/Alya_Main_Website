import React from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  highlight?: string;
  className?: string;
  subtitle?: string;
  eyebrow?: string;
  align?: 'left' | 'center' | 'right';
}

export default function Heading({
  level = 2,
  children,
  highlight,
  className,
  subtitle,
  eyebrow,
  align = 'left',
}: HeadingProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col gap-3', alignClasses[align])}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-[#781E36] bg-[#FAEDE6] px-3.5 py-1 rounded-full border border-[#E8CFC1] w-fit shadow-xs">
          {eyebrow}
        </span>
      )}

      {level === 1 && (
        <h1
          className={cn(
            'text-4xl font-extrabold tracking-tight text-[#781E36] sm:text-5xl lg:text-6xl xl:text-[56px] lg:leading-[1.12]',
            className
          )}
        >
          {children}
          {highlight && (
            <span className="ml-2 text-[#781E36] underline decoration-[#E8CFC1] decoration-wavy underline-offset-8">
              {highlight}
            </span>
          )}
        </h1>
      )}

      {level === 2 && (
        <h2
          className={cn(
            'text-3xl font-extrabold tracking-tight text-[#781E36] sm:text-4xl lg:text-[40px] leading-tight',
            className
          )}
        >
          {children}
          {highlight && <span className="text-[#781E36]"> {highlight}</span>}
        </h2>
      )}

      {level === 3 && (
        <h3 className={cn('text-2xl font-bold tracking-tight text-[#781E36]', className)}>
          {children}
        </h3>
      )}

      {subtitle && (
        <p className="max-w-2xl text-base md:text-lg leading-relaxed text-[#6B5B57]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
