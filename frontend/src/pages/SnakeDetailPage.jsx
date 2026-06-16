import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  AlertTriangle,
  ShieldCheck,
  Hospital,
  Phone,
  ChevronRight,
} from "lucide-react";

import VenomBadge from "../components/VenomBadge";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function SnakeDetailPage() {
  const { id } = useParams();

  const [snake, setSnake] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/snakes/${id}`)
      .then((response) => {
        setSnake(response.data);
        setSimilar(response.data.similar_species_data || []);
        setActiveImg(0);
      })
      .catch(console.error);
  }, [id]);

  if (!snake) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        Loading...
      </div>
    );
  }

  const galleryImages = snake.images?.length 
    ? snake.images 
    : [
        snake.thumbnail,
        snake.thumbnail,
        snake.thumbnail,
      ];

  return (
    <div data-testid={`snake-detail-${snake.slug}`}>
      <header
        className="sd-scale-pattern py-14"
        style={{
          background:
            "linear-gradient(135deg, #1A3A2A 0%, #0F2318 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            to="/snakes"
            className="text-sm text-[#E8A020] hover:underline"
          >
            ← Back to all snakes
          </Link>

          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            {snake.common_name}
          </h1>

          <p className="mt-2 font-mono text-lg italic text-[#D1D5DB]">
            {snake.scientific_name}
          </p>

          <div className="mt-4">
            <VenomBadge
              venomous={snake.is_venomous}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="sd-card overflow-hidden">
              <img
                src={galleryImages[activeImg]}
                alt={snake.common_name}
                className="aspect-[16/10] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/800x500/1A3A2A/ffffff?text=${encodeURIComponent(
                    snake.common_name
                  )}`;
                }}
              />

              <div className="flex gap-2 p-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setActiveImg(index)
                    }
                    className={`h-16 w-20 overflow-hidden rounded-md border-2 ${
                      activeImg === index
                        ? "border-[#E8A020]"
                        : "border-transparent"
                    }`}
                    data-testid={`gallery-thumb-${index}`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/80x64/1A3A2A/ffffff?text=S";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">
                About
              </h2>

              <p className="mt-3 leading-relaxed text-[#1c1c1c]">
                The {snake.common_name} (
                {snake.scientific_name}) is{" "}
                {snake.is_venomous
                  ? "a venomous"
                  : "a non-venomous"}{" "}
                snake found across{" "}
                {snake.distribution?.join(", ")}.{" "}
                {snake.behavior}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">
                Identification Guide
              </h2>

              <ul className="mt-3 space-y-2">
                {(snake.appearance?.distinguishing_features || []).map(
                  (item, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-[#1c1c1c]"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8A020]" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">
                Habitat & Distribution
              </h2>

              <p className="mt-3 text-[#1c1c1c]">
                <strong>Habitat:</strong>{" "}
                {snake.habitat?.join(", ")}
              </p>

              <p className="mt-1 text-[#1c1c1c]">
                <strong>Distribution:</strong>{" "}
                {snake.distribution?.join(", ")}
              </p>

              <div
                className="mt-4 grid h-56 place-items-center rounded-xl text-center text-sm text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #1A3A2A 0%, #2C5742 100%)",
                }}
              >
                <span className="rounded-md bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  Found across{" "}
                  {snake.distribution?.join(", ")}{" "}
                  regions
                </span>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">
                Behavior
              </h2>

              <p className="mt-3 leading-relaxed text-[#1c1c1c]">
                {snake.behavior}
              </p>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-2 lg:self-start">
            <div className="sd-card overflow-hidden">
              <div
                className="px-5 py-3 text-sm font-bold uppercase tracking-wider text-white"
                style={{
                  background:
                    snake.is_venomous
                      ? "#C0392B"
                      : "#27AE60",
                }}
              >
                {snake.is_venomous ? (
                  <span className="inline-flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Venomous
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Non-Venomous
                  </span>
                )}
              </div>

              <div className="space-y-2 p-5 text-sm">
                {snake.venom_type && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">
                      Venom
                    </span>
                    <span className="font-medium">
                      {snake.venom_type}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">
                    Size
                  </span>
                  <span className="font-mono font-medium">
                    {snake.size_range_cm?.min}-{snake.size_range_cm?.max} cm
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">
                    Active
                  </span>
                  <span className="font-medium">
                    {snake.active_period}
                  </span>
                </div>
              </div>
            </div>

            {similar.length > 0 && (
              <div className="sd-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  Similar Species
                </p>

                <div className="space-y-2">
                  {similar.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/snakes/${item.slug}`}
                      className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-[#F7F4EF]"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.common_name}
                        className="h-12 w-12 rounded-md object-cover"
                      />

                      <span className="flex-1 text-sm font-medium">
                        {item.common_name}
                      </span>

                      <ChevronRight
                        size={14}
                        className="text-[#6B7280]"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="sd-card p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#C0392B]">
                If Bitten
              </p>

              <ol className="space-y-2 text-sm">
                {snake.first_aid
                  .slice(0, 3)
                  .map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-2"
                    >
                      <span className="font-mono font-bold text-[#C0392B]">
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
              </ol>

              <Link
                to="/emergency"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1A3A2A] hover:underline"
              >
                Read full guide
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/emergency"
                className="sd-btn-danger"
                data-testid="sidebar-find-hospital"
              >
                <Hospital size={14} />
                Hospital
              </Link>

              <Link
                to="/rescuers"
                className="sd-btn-primary"
                data-testid="sidebar-call-rescuer"
              >
                <Phone size={14} />
                Rescuer
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}