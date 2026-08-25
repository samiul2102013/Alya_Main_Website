'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import Section from '../shared/Section';
import Reveal from '../shared/Reveal';
import { HeartHandshake, Landmark, Users, Eye } from 'lucide-react';

const icons = [<HeartHandshake key="1" className="h-7 w-7 text-[#781E36] group-hover:text-white transition-colors" />,
  <Landmark key="2" className="h-7 w-7 text-[#781E36] group-hover:text-white transition-colors" />,
  <Users key="3" className="h-7 w-7 text-[#781E36] group-hover:text-white transition-colors" />,
  <Eye key="4" className="h-7 w-7 text-[#781E36] group-hover:text-white transition-colors" />];

export default function FeatureGrid() {
  const t = useTranslations('home');
  const items = t.raw('stats') as { stat: string; title: string; subtitle: string }[];

  return (
    <Section background="muted" spacing="none" containerClassName="!max-w-[1440px]" className="py-[48px]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={index} delay={index * 0.1} direction="up">
            <div
              className="group relative flex h-[198px] w-full max-w-[330px] mx-auto flex-col items-center justify-between rounded-[24px] bg-white p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#781E36]"
              style={{
                boxShadow:
                  '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Icon Holder */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAEDE6] border border-[#E8CFC1] transition-colors duration-300 group-hover:bg-[#781E36]">
                {icons[index % icons.length]}
              </div>

              {/* Stat & Content */}
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black tracking-tight text-[#781E36]">
                  {item.stat}
                </span>
                <span className="text-base font-bold text-gray-900 leading-tight">
                  {item.title}
                </span>
                <span className="text-xs font-semibold text-[#6B5B57] mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
