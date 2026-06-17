import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function VenomBadge({
  venomous,
  size = "md",
  customText,
  isMild = false,
}) {
  let cls = venomous
    ? "sd-badge-danger"
    : "sd-badge-safe";
  if (isMild) cls = "bg-[#E8A020] text-white shadow-[0_2px_8px_rgba(232,160,32,0.3)]";

  const text = customText || (venomous
    ? "Venomous"
    : "Non-Venomous");

  const Icon = venomous || isMild
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