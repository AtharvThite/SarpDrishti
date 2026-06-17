import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import VenomBadge from "./VenomBadge";

export default function SnakeCard({ snake }) {
  return (
    <Link
      to={`/snakes/${snake.slug}`}
      className="sd-card group block overflow-hidden"
      data-testid={`snake-card-${snake.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1A3A2A]/10 to-[#0F2318]/20">
        <img
          src={snake.thumbnail}
          alt={snake.common_name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x300/1A3A2A/ffffff?text=${encodeURIComponent(
              snake.common_name
            )}`;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute left-3 top-3">
          <VenomBadge
            venomous={snake.is_venomous}
            size="sm"
            isMild={snake.slug === "green-tree-vine"}
            customText={snake.slug === "green-tree-vine" ? "Mildly venomous - Harmless for humans" : undefined}
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-[#1c1c1c] group-hover:text-[#1A3A2A] transition-colors duration-300">
          {snake.common_name}
        </h3>

        <p className="font-mono text-xs italic text-[#6B7280]">
          {snake.scientific_name}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(snake.habitat || [])
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="sd-badge sd-badge-muted"
                style={{
                  padding: "0.15rem 0.55rem",
                  fontSize: 10,
                }}
              >
                {tag}
              </span>
            ))}
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A3A2A] group-hover:text-[#E8A020] transition-colors duration-300">
          View Details
          <ArrowRight
            size={14}
            className="transition-all duration-300 group-hover:translate-x-2"
          />
        </div>
      </div>
    </Link>
  );
}