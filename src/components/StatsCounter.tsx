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
  const [done, setDone] = useState(false);
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
        setDone(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <div ref={ref} className={`text-3xl md:text-4xl font-extrabold text-gradient transition-all duration-500 ${done ? 'scale-100' : 'scale-95'}`}>
      {started ? count.toLocaleString('en-IN') : '0'}{suffix}
    </div>
  );
}

export default function StatsCounter({ stats }: Props) {
  return (
    <section className="py-10 relative">
      <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card group">
            <div className="text-2xl mb-3 group-hover:scale-110 group-hover:animate-bounce-gentle transition-transform duration-300">
              {s.icon}
            </div>
            <AnimatedNumber target={s.number} suffix={s.suffix} />
            <div className="text-sm text-slate-500 mt-2 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
