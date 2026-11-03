import React from 'react';

interface EtecLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white';
}

export const EtecLogo: React.FC<EtecLogoProps> = ({ className = 'h-8', variant = 'full' }) => {
  const isWhite = variant === 'white';
  const redColor = '#B5121B';
  const textColor = isWhite ? '#FFFFFF' : '#0F172A';
  const mutedTextColor = isWhite ? '#CBD5E1' : '#64748B';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official ETEC Emblem (3 bars stylized geometric red mark) */}
      <svg
        viewBox="0 0 48 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto shrink-0"
        aria-label="Logo ETEC"
      >
        {/* Left vertical pillar */}
        <path
          d="M4 6C4 4.89543 4.89543 4 6 4H12C13.1046 4 14 4.89543 14 6V32C14 33.1046 13.1046 34 12 34H6C4.89543 34 4 33.1046 4 32V6Z"
          fill={redColor}
        />
        {/* Middle angled pillar */}
        <path
          d="M19 12C19 10.8954 19.8954 10 21 10H27C28.1046 10 29 10.8954 29 12V32C29 33.1046 28.1046 34 27 34H21C19.8954 34 19 33.1046 19 32V12Z"
          fill={redColor}
        />
        {/* Right slanted pillar */}
        <path
          d="M34 18C34 16.8954 34.8954 16 36 16H42C43.1046 16 44 16.8954 44 18V32C44 33.1046 43.1046 34 42 34H36C34.8954 34 34 33.1046 34 32V18Z"
          fill={redColor}
        />
        {/* Horizontal top connection accent bar */}
        <path
          d="M4 6C4 4.89543 4.89543 4 6 4H42C43.1046 4 44 4.89543 44 6V8C44 9.10457 43.1046 10 42 10H6C4.89543 10 4 9.10457 4 8V6Z"
          fill={redColor}
        />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className="text-2xl font-black tracking-tight"
            style={{ color: redColor, letterSpacing: '-0.03em' }}
          >
            etec
          </span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: textColor }}>
            Atende
          </span>
        </div>
        {variant === 'full' && (
          <span className="text-[10px] font-medium tracking-tight mt-0.5" style={{ color: mutedTextColor }}>
            Centro Paula Souza · SP
          </span>
        )}
      </div>
    </div>
  );
};

export const CPSLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="flex flex-col text-left leading-none border-l-2 border-red-700 pl-2">
        <span className="text-[11px] font-bold text-slate-900 tracking-tight">Centro Paula Souza</span>
        <span className="text-[9px] text-slate-500 font-medium">Governo do Estado de São Paulo</span>
      </div>
    </div>
  );
};
