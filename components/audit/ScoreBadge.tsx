'use client';

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const radius = 36;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colour = score >= 90 ? '#22c55e' : score >= 70 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90" viewBox="0 0 90 90" aria-label={`Accessibility score: ${score}%`}>
        {/* Background ring */}
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress ring */}
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Score text */}
        <text
          x="45"
          y="45"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-lg font-bold"
          fill={colour}
        >
          {score}%
        </text>
      </svg>
      <span className="text-xs text-gray-500 mt-1">Contrast Score</span>
    </div>
  );
}
