import React from 'react';

export default function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full border-b border-[#E8CFC1] pb-[10px] pt-[10px]">
      <h2 className="text-xl sm:text-2xl font-bold text-[#781E36]">{children}</h2>
    </div>
  );
}
