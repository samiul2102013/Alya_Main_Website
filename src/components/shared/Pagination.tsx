'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function getPageItems(current: number, totalPages: number, siblings = 1): (number | '…')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(2, current - siblings);
  const right = Math.min(totalPages - 1, current + siblings);

  const items: (number | '…')[] = [1];
  if (left > 2) items.push('…');

  for (let i = left; i <= right; i++) items.push(i);

  if (right < totalPages - 1) items.push('…');
  items.push(totalPages);
  return items;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  className = '',
}: PaginationProps) {
  const pages = getPageItems(page, totalPages, siblingCount);

  return (
    <nav className={`flex flex-wrap items-center justify-center gap-[10px] ${className}`} aria-label="Pagination">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#E8CFC1] bg-white text-[#6B5B57] transition-colors hover:border-[#781E36] hover:text-[#781E36] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E8CFC1] disabled:hover:text-[#6B5B57]"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>

      {pages.map((item, i) =>
        item === '…' ? (
          <span key={`e-${i}`} className="flex h-[42px] w-[42px] items-center justify-center text-sm font-bold text-[#6B5B57]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={`h-[42px] w-[42px] text-sm font-bold transition-colors ${
              item === page
                ? 'rounded-[10px] bg-[#781E36] text-white shadow-sm'
                : 'rounded-[10px] border border-[#E8CFC1] bg-white text-[#6B5B57] hover:border-[#781E36] hover:text-[#781E36]'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#E8CFC1] bg-white text-[#6B5B57] transition-colors hover:border-[#781E36] hover:text-[#781E36] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E8CFC1] disabled:hover:text-[#6B5B57]"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}
