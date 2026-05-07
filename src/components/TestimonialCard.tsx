'use client';
import { Testimonial } from '@/types';

interface Props {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: Props) {
  const gradients = [
    'from-indigo-50 to-purple-50',
    'from-emerald-50 to-teal-50',
    'from-amber-50 to-orange-50',
  ];

  const avatarGradients = [
    'from-indigo-600 to-indigo-400',
    'from-emerald-600 to-emerald-400',
    'from-amber-600 to-orange-400',
  ];

  return (
    <div className={`glass-card-light p-7 relative group hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br ${gradients[index % 3]}`}>
      {/* Quote icon */}
      <div className="absolute top-5 right-5 text-5xl font-serif text-indigo-200 opacity-40 group-hover:opacity-70 transition-opacity duration-300 select-none">
        &ldquo;
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={i <= testimonial.rating ? '#F59E0B' : '#E2E8F0'}
            stroke={i <= testimonial.rating ? '#F59E0B' : '#E2E8F0'}
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-slate-600 leading-relaxed mb-5 min-h-[60px]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[index % 3]} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-button`}>
          {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">{testimonial.name}</div>
          <div className="text-xs text-slate-500">{testimonial.college}</div>
        </div>
      </div>
    </div>
  );
}
