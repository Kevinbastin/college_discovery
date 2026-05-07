export default function CollegeCardSkeleton() {
  return (
    <div className="card-enterprise p-5 min-h-[320px] flex flex-col">
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-4 w-1/2 mb-2.5" />
      <div className="skeleton h-4 w-1/3 mb-2.5" />
      <div className="skeleton h-4 w-2/5 mb-3" />
      <div className="flex gap-1.5 mb-3">
        <div className="skeleton h-6 w-20 rounded-md" />
        <div className="skeleton h-6 w-16 rounded-md" />
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="skeleton h-5 w-14 rounded-md" />
        <div className="skeleton h-5 w-14 rounded-md" />
        <div className="skeleton h-5 w-14 rounded-md" />
      </div>
      <div className="skeleton h-4 w-1/3 mt-auto mb-3" />
      <div className="flex gap-2.5 mt-auto">
        <div className="skeleton h-10 flex-1 rounded-lg" />
        <div className="skeleton h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}
