'use client';

export default function SealScore({ score, size = 72 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? '#C9A961' : score >= 50 ? '#8B93A7' : '#5A6478';

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="seal-ring" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245,243,237,0.08)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-semibold text-parchment" style={{ fontSize: size * 0.28 }}>
          {score}
        </span>
      </div>
    </div>
  );
}
