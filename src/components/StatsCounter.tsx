'use client';
import { useState, useEffect, useRef } from 'react';

interface StatItem {
  number: number;
  suffix: string;
  label: string;
  icon: string;
}

interface Props {
  stats: StatItem[];
}

function AnimatedNumber({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-5xl font-bold text-gradient">
      {started ? count.toLocaleString('en-IN') : '0'}{suffix}
    </div>
  );
}

export default function StatsCounter({ stats }: Props) {
  return (
    <section className="bg-white border-y border-[#E2E8F0] py-10">
      <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label} className="group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
            <AnimatedNumber target={s.number} suffix={s.suffix} />
            <div className="text-sm text-[#64748B] mt-2 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
