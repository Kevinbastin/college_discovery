interface Props {
  slot?: string;
  format?: 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export default function AdSenseSlot({ slot, format = 'rectangle', className = '', label }: Props) {
  const heightMap = {
    rectangle: 'min-h-[250px]',
    horizontal: 'min-h-[90px]',
    vertical: 'min-h-[600px]',
  };

  return (
    <div className={`adsense-slot ${format === 'rectangle' ? 'adsense-slot-sidebar' : ''} ${heightMap[format]} ${className}`}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-slate-400 text-xs font-medium">{label || 'Advertisement'}</span>
        {/* Replace this with actual AdSense code in production:
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXX"
                 data-ad-slot={slot}
                 data-ad-format="auto"
                 data-full-width-responsive="true" />
        */}
      </div>
    </div>
  );
}
