import { Phone, MessageCircle, Star, CheckCircle2 } from "lucide-react";

export default function RescuerCard({ rescuer }) {
  const nameString = rescuer.name || "?";
  const initial = nameString.charAt(0).toUpperCase();
  const phoneString = rescuer.phone || "";
  const phoneTel = `tel:${phoneString.replace(/\s/g, "")}`;

  return (
    <div
      className="sd-card flex flex-col p-5"
      data-testid={`rescuer-card-${rescuer._id}`}
    >
      <div className="flex items-start gap-4">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-2xl font-bold text-white shadow-lg transition-transform duration-300 hover:scale-110"
          style={{
            background: `linear-gradient(135deg, #1A3A2A, #1A3A2Add)`,
          }}
        >
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold text-[#1c1c1c]">
              {rescuer.name}
            </h3>

            {rescuer.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#27AE60]/10 to-[#2ecc71]/10 px-2 py-0.5 text-xs font-medium text-[#27AE60] shadow-sm">
                <CheckCircle2 size={12} />
                Verified
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(rescuer.districts_covered || []).map((district) => (
              <span
                key={district}
                className="sd-badge sd-badge-muted"
                style={{
                  padding: "0.15rem 0.55rem",
                  fontSize: 10,
                }}
              >
                {district}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="inline-flex items-center gap-1.5 font-medium">
          <Star
            size={14}
            className="fill-[#E8A020] stroke-[#E8A020] drop-shadow-sm"
          />
          <span>{rescuer.rating}</span>
          <span className="text-[#6B7280]">
            · {rescuer.total_rescues} rescues
          </span>
        </div>

        {rescuer.is_available ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#27AE60]/10 to-[#2ecc71]/10 px-2.5 py-1 text-xs font-medium text-[#27AE60]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#27AE60] subtle-bounce" />
            Available Now
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600">
            Off Duty
          </span>
        )}
      </div>

      <p className="mt-3 font-mono text-sm text-[#6B7280]">
        {rescuer.phone}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={phoneTel}
          className="sd-btn-primary"
          style={{
            padding: "0.55rem 0.8rem",
            fontSize: 14,
          }}
          data-testid={`call-rescuer-${rescuer._id}`}
        >
          <Phone size={14} />
          Call
        </a>

        <a
          href={`https://wa.me/${(rescuer.whatsapp || rescuer.phone || "").replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            padding: "0.55rem 0.8rem",
          }}
          data-testid={`whatsapp-rescuer-${rescuer._id}`}
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}