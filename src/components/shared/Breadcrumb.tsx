'use client';
import React from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-[6px] h-[29px] max-w-[1280px] flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="h-3 w-3 text-[#6B5B57] rtl:rotate-180 shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-xs font-semibold text-[#6B5B57] hover:text-[#781E36] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-xs font-semibold text-[#781E36]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
