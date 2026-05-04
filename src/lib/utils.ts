export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatLPA(amount: number): string {
  return '₹' + amount.toFixed(2) + ' LPA';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function timeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// --- Advanced Utilities ---

export function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

export function getExamLabel(exam: string): string {
  const labels: Record<string, string> = {
    JEE_MAIN: 'JEE Main',
    JEE_ADVANCED: 'JEE Advanced',
    NEET: 'NEET',
    CAT: 'CAT',
    GATE: 'GATE',
  };
  return labels[exam] || exam;
}

export function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    General: 'General',
    OBC: 'OBC (Non-Creamy Layer)',
    SC: 'Scheduled Caste',
    ST: 'Scheduled Tribe',
    EWS: 'Economically Weaker Section',
  };
  return labels[cat] || cat;
}

export function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

export function generateStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('full');
    else if (rating >= i - 0.5) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}
