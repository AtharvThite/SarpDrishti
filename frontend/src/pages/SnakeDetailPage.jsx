import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  AlertTriangle,
  ShieldCheck,
  Hospital,
  Phone,
  ChevronRight,
  ChevronLeft,
  Sparkles,
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

  const galleryImages = snake?.images?.length 
    ? snake.images 
    : snake?.thumbnail 
      ? [snake.thumbnail, snake.thumbnail, snake.thumbnail]
      : [];

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  if (!snake) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        Loading...
      </div>
    );
  }

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
            <div className="sd-card overflow-hidden relative group bg-black/5">
              <img
                key={activeImg}
                src={galleryImages[activeImg]}
                alt={snake.common_name}
                className="aspect-[16/10] w-full object-cover fade-in"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/800x500/1A3A2A/ffffff?text=${encodeURIComponent(
                    snake.common_name
                  )}`;
                }}
              />

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-all duration-300 hover:bg-black/70 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={() => setActiveImg((prev) => (prev + 1) % galleryImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-all duration-300 hover:bg-black/70 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}

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

              {snake.common_name_regional && Object.keys(snake.common_name_regional).length > 0 && (
                <div className="mt-4 rounded-xl bg-white p-4 shadow-sm border border-[#E9E3D7]">
                  <h3 className="font-semibold text-[#1A3A2A] mb-2">Regional Names</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#4a4a4a]">
                    {Object.entries(snake.common_name_regional).map(([lang, name]) => (
                      <span key={lang}>
                        <strong className="capitalize text-[#1c1c1c]">{lang}:</strong> {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">
                Diet
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {snake.diet?.map((food, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#E9E3D7] px-3 py-1 text-sm font-medium text-[#1c1c1c] capitalize"
                  >
                    {food}
                  </span>
                ))}
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

            {snake.lifespan_years && (
              <section className="mt-8">
                <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">Biology & Lifecycle</h2>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-[#E9E3D7]">
                    <h3 className="font-semibold text-[#1A3A2A] mb-2">Lifespan</h3>
                    <p className="text-[#6B7280] text-sm"><strong>Wild:</strong> {snake.lifespan_years.wild} years</p>
                    <p className="text-[#6B7280] text-sm"><strong>Captivity:</strong> {snake.lifespan_years.captivity} years</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-[#E9E3D7]">
                    <h3 className="font-semibold text-[#1A3A2A] mb-2">Reproduction</h3>
                    <p className="text-[#6B7280] text-sm"><strong>Type:</strong> {snake.reproduction?.type}</p>
                    <p className="text-[#6B7280] text-sm"><strong>Clutch Size:</strong> {snake.reproduction?.offspring_per_clutch}</p>
                    <p className="text-[#6B7280] text-sm"><strong>Season:</strong> {snake.reproduction?.breeding_season}</p>
                  </div>
                </div>
              </section>
            )}

            {snake.ecological_role && (
              <section className="mt-8">
                <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">Ecology & Conservation</h2>
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E0D2]">
                    <h3 className="font-semibold text-[#1A3A2A] mb-1">Ecological Role</h3>
                    <p className="text-[#6B7280] text-sm">{snake.ecological_role}</p>
                  </div>
                  
                  {snake.benefits_to_humans?.length > 0 && (
                    <div className="rounded-xl bg-[#F9FAFB] p-4 border border-[#E5E0D2]">
                      <h3 className="font-semibold text-[#1A3A2A] mb-1">Benefits to Humans</h3>
                      <ul className="list-disc list-inside text-[#6B7280] text-sm space-y-1 mt-2">
                        {snake.benefits_to_humans.map((benefit, i) => <li key={i}>{benefit}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white p-4 border border-[#E5E0D2]">
                      <h3 className="font-semibold text-[#1A3A2A] mb-3">Natural Predators</h3>
                      <div className="flex flex-wrap gap-2">
                        {snake.natural_predators?.map((p, i) => (
                          <span key={i} className="rounded-full bg-[#1A3A2A]/5 text-[#1A3A2A] px-3 py-1 text-xs font-semibold">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 border border-[#E5E0D2]">
                      <h3 className="font-semibold text-[#1A3A2A] mb-3">Conservation Threats</h3>
                      <div className="flex flex-wrap gap-2">
                        {snake.conservation_threats?.map((t, i) => (
                          <span key={i} className="rounded-full bg-[#C0392B]/10 text-[#C0392B] px-3 py-1 text-xs font-semibold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {(snake.interesting_facts || snake.did_you_know || snake.myths_and_facts) && (
              <section className="mt-8">
                <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">Fascinating Facts</h2>
                
                {snake.did_you_know && (
                  <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#FDF7EC] to-[#FFFBF5] p-5 shadow-sm border border-[#E8A020]/20 flex items-start gap-4">
                    <div className="text-[#E8A020] mt-1"><Sparkles size={24} /></div>
                    <div>
                      <h3 className="font-bold text-[#E8A020] mb-1">Did You Know?</h3>
                      <p className="text-[#1c1c1c] font-medium">{snake.did_you_know}</p>
                    </div>
                  </div>
                )}

                {snake.interesting_facts?.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {snake.interesting_facts.map((fact, index) => (
                      <li key={index} className="flex gap-3 text-[#1c1c1c]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8A020]" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {snake.myths_and_facts?.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-[#1A3A2A]">Myths Busted</h3>
                    {snake.myths_and_facts.map((mf, index) => (
                      <div key={index} className="rounded-xl bg-white p-4 border border-[#E9E3D7]">
                        <p className="text-sm text-[#C0392B] font-medium mb-1">Myth: {mf.myth}</p>
                        <p className="text-sm text-[#27AE60] font-medium">Fact: {mf.fact}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
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
                {snake.human_risk_level && (
                  <div className="flex justify-between mb-3 border-b border-black/5 pb-3">
                    <span className="text-[#6B7280]">
                      Risk Level
                    </span>
                    <span className={`font-semibold ${snake.human_risk_level === 'Extreme' ? 'text-[#C0392B]' : snake.human_risk_level === 'Moderate' ? 'text-[#E8A020]' : 'text-[#27AE60]'}`}>
                      {snake.human_risk_level}
                    </span>
                  </div>
                )}

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
                  <span className="font-medium capitalize text-right">
                    {snake.active_period}
                    {snake.peak_activity && <span className="block text-xs font-normal text-[#6B7280] mt-0.5">{snake.peak_activity}</span>}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">
                    IUCN Status
                  </span>
                  <span className={`font-medium ${
                    snake.iucn_status === "Least Concern" ? "text-green-600" : "text-amber-600"
                  }`}>
                    {snake.iucn_status}
                  </span>
                </div>

                {snake.is_protected && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">
                      Protected Status
                    </span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <ShieldCheck size={14} /> Yes
                    </span>
                  </div>
                )}
                
                {snake.time_to_symptoms_hours && snake.time_to_symptoms_hours.max > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">
                      Symptoms in
                    </span>
                    <span className="font-medium">
                      {snake.time_to_symptoms_hours.min}-{snake.time_to_symptoms_hours.max} hrs
                    </span>
                  </div>
                )}
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
                  ?.slice(0, 3)
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

              {snake.antivenom && snake.antivenom !== "Not required" && (
                <div className="mt-4 rounded-md bg-[#FDF2F2] p-3 text-sm text-[#C0392B] border border-[#F9DEDC]">
                  <strong>Antivenom:</strong> {snake.antivenom}
                </div>
              )}

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