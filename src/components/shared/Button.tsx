import React from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  width?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  icon,
  className,
  width,
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-[12px] border-2 focus:outline-none focus:ring-2 focus:ring-[#781E36]/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden group';

  const variants = {
    primary:
      'bg-[#781E36] text-white border-[#781E36] hover:bg-[#B83A4A] hover:border-[#B83A4A] shadow-lg shadow-[#781E36]/25 hover:shadow-xl hover:shadow-[#781E36]/40',
    secondary:
      'bg-white text-[#781E36] border-[#781E36] hover:bg-[#781E36] hover:text-white shadow-sm hover:shadow-md',
    outline:
      'bg-transparent text-[#781E36] border-[#E8CFC1] hover:border-[#781E36] hover:bg-[#FAEDE6]',
    ghost:
      'bg-transparent text-[#781E36] border-transparent hover:bg-[#FAEDE6]',
    white:
      'bg-white text-[#781E36] border-white hover:bg-[#FAEDE6] shadow-xl hover:shadow-2xl hover:scale-105',
  };

  const sizes = {
    sm: 'px-6 py-2.5 text-sm h-[40px] gap-2',
    md: 'px-8 py-[12px] text-base h-[48px] gap-2.5',
    lg: 'px-[32px] py-[14px] text-base md:text-lg h-[56px] min-w-[210px] gap-3',
  };

  const content = (
    <>
      {/* Animated shimmer shine effect */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5">
          {icon}
        </span>
      )}
    </>
  );

  const styleAttr = width ? { width } : undefined;

  if (href) {
    return (
      <Link
        href={href}
        style={styleAttr}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      style={styleAttr}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {content}
    </button>
  );
}
