import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function VenomBadge({
  venomous,
  size = "md",
}) {
  const cls = venomous
    ? "sd-badge-danger"
    : "sd-badge-safe";

  const text = venomous
    ? "Venomous"
    : "Non-Venomous";

  const Icon = venomous
    ? ShieldAlert
    : ShieldCheck;

  const padding =
    size === "sm"
      ? {
          padding: "0.2rem 0.6rem",
          fontSize: 10,
        }
      : {};

  return (
    <span
      className={`sd-badge ${cls} transition-all duration-300 hover:scale-105`}
      style={padding}
      data-testid={`venom-badge-${
        venomous ? "venomous" : "safe"
      }`}
    >
      <Icon size={size === "sm" ? 10 : 12} />
      {text}
    </span>
  );
}