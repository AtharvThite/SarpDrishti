export default function ConfidenceBar({ value = 0 }) {
  const numValue = Number(value) || 0;
  const percentage = numValue <= 1 ? numValue * 100 : numValue;
  const confidence = Math.round(Math.min(100, Math.max(0, percentage)));

  const getColor = () => {
    if (confidence >= 80) return "linear-gradient(90deg, #27AE60, #2ecc71)";
    if (confidence >= 50) return "linear-gradient(90deg, #E8A020, #F3B94A)";
    return "linear-gradient(90deg, #C0392B, #e04835)";
  };

  return (
    <div className="w-full" data-testid="confidence-bar">
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-[#6B7280]">
          Confidence
        </span>

        <span className="font-mono font-semibold text-[#1A3A2A]">
          {confidence}%
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#E9E3D7] to-[#f0ebe0] shadow-inner">
        <div
          className="h-full rounded-full animate-bar-grow relative overflow-hidden"
          style={{
            width: `${confidence}%`,
            background: getColor(),
            boxShadow: "0 2px 8px rgba(232, 160, 32, 0.3)",
          }}
        >
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </div>
  );
}