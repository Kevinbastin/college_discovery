'use client';
import { useState } from 'react';

interface FilterValues {
  state: string;
  type: string;
  minFees: string;
  maxFees: string;
  naac: string[];
  minRating: string;
  courses: string[];
  exams: string[];
  established: string;
}

interface Props {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  states: string[];
}

const NAAC_GRADES = ['A++', 'A+', 'A', 'B++', 'B+'];
const COURSE_OPTIONS = ['B.Tech', 'MBA', 'MBBS', 'BBA', 'B.Sc', 'LLB', 'B.Com', 'B.A', 'M.Tech', 'PhD'];
const EXAM_OPTIONS = [
  { value: 'JEE_MAIN', label: 'JEE Main' },
  { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
  { value: 'NEET', label: 'NEET' },
  { value: 'CAT', label: 'CAT' },
  { value: 'GATE', label: 'GATE' },
];
const RATING_OPTIONS = [
  { label: '4+ Stars', value: '4' },
  { label: '3.5+ Stars', value: '3.5' },
  { label: '3+ Stars', value: '3' },
];
const ESTABLISHED_OPTIONS = [
  { label: 'Before 1960', value: 'before_1960' },
  { label: '1960–1990', value: '1960_1990' },
  { label: '1990–2010', value: '1990_2010' },
  { label: 'After 2010', value: 'after_2010' },
];

export default function FilterSidebar({ values, onChange, onClear, states }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    state: true, type: true, fees: true, naac: true, rating: true, courses: true, exams: false, established: false,
  });

  const activeFilters: { label: string; key: string; value: string }[] = [];
  if (values.state) activeFilters.push({ label: values.state, key: 'state', value: '' });
  if (values.type) activeFilters.push({ label: values.type === 'GOVERNMENT' ? 'Government' : 'Private', key: 'type', value: '' });
  if (values.minFees) activeFilters.push({ label: `Min ₹${Number(values.minFees).toLocaleString('en-IN')}`, key: 'minFees', value: '' });
  if (values.maxFees) activeFilters.push({ label: `Max ₹${Number(values.maxFees).toLocaleString('en-IN')}`, key: 'maxFees', value: '' });
  values.naac.forEach(g => activeFilters.push({ label: `NAAC ${g}`, key: 'naac', value: g }));
  if (values.minRating) activeFilters.push({ label: `${values.minRating}+ Stars`, key: 'minRating', value: '' });
  values.courses.forEach(c => activeFilters.push({ label: c, key: 'courses', value: c }));
  values.exams.forEach(e => activeFilters.push({ label: EXAM_OPTIONS.find(o => o.value === e)?.label || e, key: 'exams', value: e }));
  if (values.established) activeFilters.push({ label: ESTABLISHED_OPTIONS.find(o => o.value === values.established)?.label || values.established, key: 'established', value: '' });

  const activeCount = activeFilters.length;

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const update = (partial: Partial<FilterValues>) => {
    onChange({ ...values, ...partial });
  };

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const removeFilter = (key: string, value: string) => {
    if (key === 'naac') update({ naac: values.naac.filter(v => v !== value) });
    else if (key === 'courses') update({ courses: values.courses.filter(v => v !== value) });
    else if (key === 'exams') update({ exams: values.exams.filter(v => v !== value) });
    else update({ [key]: key === 'naac' || key === 'courses' || key === 'exams' ? [] : '' } as any);
  };

  const Section = ({ id, title, children, count }: { id: string; title: string; children: React.ReactNode; count?: number }) => (
    <div className="border-b border-[#E2E8F0] py-3">
      <button onClick={() => toggleSection(id)} className="flex items-center justify-between w-full text-sm font-semibold text-[#1E293B]">
        <span className="flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="bg-[#2563EB] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>
          )}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${openSections[id] ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {openSections[id] && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="font-bold text-sm text-[#1E293B]">Filters</span>
          {activeCount > 0 && (
            <span className="bg-[#2563EB] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeCount}</span>
          )}
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-[#E2E8F0]">
          {activeFilters.map((f, i) => (
            <button key={`${f.key}-${f.value}-${i}`} onClick={() => removeFilter(f.key, f.value)}
              className="inline-flex items-center gap-1 bg-[#EFF6FF] text-[#2563EB] text-[11px] font-medium px-2 py-1 rounded-full hover:bg-[#DBEAFE] transition-colors">
              {f.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          ))}
        </div>
      )}

      <Section id="state" title="State / Location" count={values.state ? 1 : 0}>
        <select value={values.state} onChange={e => update({ state: e.target.value })}
          className="input-field !h-[36px] text-sm">
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Section>

      <Section id="type" title="College Type" count={values.type ? 1 : 0}>
        {['GOVERNMENT', 'PRIVATE'].map(t => (
          <label key={t} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.type === t} onChange={() => update({ type: values.type === t ? '' : t })}
              className="w-4 h-4 accent-[#2563EB]" />
            {t === 'GOVERNMENT' ? 'Government' : 'Private'}
          </label>
        ))}
      </Section>

      <Section id="fees" title="Fees Range" count={(values.minFees || values.maxFees) ? 1 : 0}>
        <div className="flex gap-2">
          <input type="number" placeholder="Min ₹" value={values.minFees} onChange={e => update({ minFees: e.target.value })}
            className="input-field !h-[36px] text-sm flex-1" />
          <input type="number" placeholder="Max ₹" value={values.maxFees} onChange={e => update({ maxFees: e.target.value })}
            className="input-field !h-[36px] text-sm flex-1" />
        </div>
      </Section>

      <Section id="exams" title="Exams Accepted" count={values.exams.length}>
        {EXAM_OPTIONS.map(e => (
          <label key={e.value} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.exams.includes(e.value)} onChange={() => update({ exams: toggleArray(values.exams, e.value) })}
              className="w-4 h-4 accent-[#2563EB]" />
            {e.label}
          </label>
        ))}
      </Section>

      <Section id="naac" title="NAAC Grade" count={values.naac.length}>
        {NAAC_GRADES.map(g => (
          <label key={g} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.naac.includes(g)} onChange={() => update({ naac: toggleArray(values.naac, g) })}
              className="w-4 h-4 accent-[#2563EB]" />
            {g}
          </label>
        ))}
      </Section>

      <Section id="rating" title="Rating" count={values.minRating ? 1 : 0}>
        {RATING_OPTIONS.map(r => (
          <label key={r.value} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="radio" name="rating" checked={values.minRating === r.value}
              onChange={() => update({ minRating: values.minRating === r.value ? '' : r.value })}
              className="w-4 h-4 accent-[#2563EB]" />
            {r.label}
          </label>
        ))}
      </Section>

      <Section id="courses" title="Courses Offered" count={values.courses.length}>
        {COURSE_OPTIONS.map(c => (
          <label key={c} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.courses.includes(c)} onChange={() => update({ courses: toggleArray(values.courses, c) })}
              className="w-4 h-4 accent-[#2563EB]" />
            {c}
          </label>
        ))}
      </Section>

      <Section id="established" title="Established Year" count={values.established ? 1 : 0}>
        {ESTABLISHED_OPTIONS.map(e => (
          <label key={e.value} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="radio" name="established" checked={values.established === e.value}
              onChange={() => update({ established: values.established === e.value ? '' : e.value })}
              className="w-4 h-4 accent-[#2563EB]" />
            {e.label}
          </label>
        ))}
      </Section>

      <button onClick={onClear} className="btn-danger text-sm mt-3 w-full text-center">Clear All Filters</button>
    </div>
  );
}
