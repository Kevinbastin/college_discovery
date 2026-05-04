'use client';
import { Review } from '@/types';
import { timeAgo } from '@/lib/utils';

interface Props {
  review: Review;
}

function StarBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#64748B] w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(value / 5) * 100}%`,
            background: value >= 4 ? '#16A34A' : value >= 3 ? '#EAB308' : '#DC2626',
          }}
        />
      </div>
      <span className="text-xs font-bold text-[#1E293B] w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewCard({ review }: Props) {
  return (
    <div className="card-premium p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {review.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-bold text-[#1E293B]">{review.authorName}</div>
            <div className="text-xs text-[#94A3B8]">{timeAgo(review.date)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#F97316] text-white px-2 py-0.5 rounded text-xs font-bold">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {review.rating.toFixed(1)}
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="text-sm font-bold text-[#1E293B] mb-2">{review.title}</h4>
      )}

      {/* Text */}
      <p className="text-sm text-[#475569] leading-relaxed mb-4">{review.text}</p>

      {/* Rating breakdown */}
      <div className="space-y-2 bg-[#F8FAFC] rounded-lg p-3">
        <StarBar label="Infrastructure" value={review.infrastructure} />
        <StarBar label="Faculty" value={review.faculty} />
        <StarBar label="Placements" value={review.placements} />
        <StarBar label="Campus Life" value={review.campusLife} />
      </div>

      {/* Helpful */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#E2E8F0]">
        <button className="text-xs text-[#64748B] hover:text-[#2563EB] transition-colors flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 22V11l-4-1 8-9 1 6h6l-1 7H7z" />
          </svg>
          Helpful ({review.helpful})
        </button>
      </div>
    </div>
  );
}
