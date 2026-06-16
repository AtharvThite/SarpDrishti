import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  label = "Analyzing...",
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8"
      data-testid="loading-spinner"
    >
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(232, 160, 32, 0.15), transparent 70%)",
            transform: "scale(2.5)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />
        <Loader2
          className="animate-spin text-[#E8A020] drop-shadow-lg"
          size={44}
        />
      </div>

      <p className="font-medium text-[#1A3A2A] fade-up">
        {label}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-[#E8A020]"
            style={{
              animation: "subtleBounce 1.4s ease-in-out infinite",
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}