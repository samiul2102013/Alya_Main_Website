import React from 'react';
import Container from './Container';
import { cn } from '@/lib/utils';

export interface SectionProps {
  children: React.ReactNode;
  background?: 'default' | 'muted' | 'inverted';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
  containerClassName?: string;
}

export default function Section({
  children,
  background = 'default',
  spacing = 'lg',
  id,
  className,
  containerClassName,
}: SectionProps) {
  const bgClasses = {
    default: 'bg-white text-gray-900',
    muted: 'bg-[#FAEDE6] text-gray-900',
    inverted: 'bg-[#781E36] text-white',
  };

  const spacingClasses = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
  };

  return (
    <section
      id={id}
      className={cn(bgClasses[background], spacingClasses[spacing], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
