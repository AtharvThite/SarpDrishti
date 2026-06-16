export default function FirstAidStep({
  number,
  text,
  danger = false,
}) {
  return (
    <div
      className="flex items-start gap-3 fade-up group"
      data-testid={`first-aid-step-${number}`}
      style={{ animationDelay: `${number * 100}ms` }}
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110"
        style={{
          background: danger
            ? "linear-gradient(135deg, #C0392B, #e04835)"
            : "linear-gradient(135deg, #1A3A2A, #2C5742)",
          boxShadow: danger
            ? "0 3px 12px rgba(192, 57, 43, 0.3)"
            : "0 3px 12px rgba(26, 58, 42, 0.3)",
        }}
      >
        {number}
      </span>

      <p className="pt-0.5 text-sm leading-relaxed text-[#1c1c1c] group-hover:text-[#1A3A2A] transition-colors duration-300">
        {text}
      </p>
    </div>
  );
}