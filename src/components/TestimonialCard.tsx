'use client';
import { Testimonial } from '@/types';

interface Props {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: Props) {
  const gradients = [
    'from-blue-500/10 to-purple-500/10',
    'from-emerald-500/10 to-teal-500/10',
    'from-orange-500/10 to-amber-500/10',
  ];

  return (
    <div className={`glass-card-light p-6 relative group hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br ${gradients[index % 3]}`}>
      {/* Quote icon */}
      <div className="absolute top-4 right-4 text-4xl text-[#CBD5E1] opacity-50 group-hover:opacity-80 transition-opacity">
        &ldquo;
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={i <= testimonial.rating ? '#F97316' : '#E2E8F0'}
            stroke={i <= testimonial.rating ? '#F97316' : '#E2E8F0'}
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-[#475569] leading-relaxed mb-4 italic min-h-[60px]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0]/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-bold text-[#1E293B]">{testimonial.name}</div>
          <div className="text-xs text-[#64748B]">{testimonial.college}</div>
        </div>
      </div>
    </div>
  );
}
