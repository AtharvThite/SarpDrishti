import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Camera,
  Upload,
  Siren,
  ChevronRight,
  ShieldCheck,
  Users,
  Clock,
  Zap,
  Eye,
  Heart,
  Sparkles,
} from "lucide-react";

import SnakeCard from "../components/SnakeCard";
import LoadingSpinner from "../components/LoadingSpinner";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const SNAKE_FACTS = [
  "King Cobras are the only snakes in the world that build nests for their eggs.",
  "Some snakes can survive for months without a single meal by drastically lowering their metabolism.",
  "Snakes don't smell with their noses; they use their forked tongues to gather scent particles.",
  "Snakes do not have eyelids and cannot blink. They sleep with their eyes open!",
  "The Indian Rock Python is massive and can easily exceed 5 meters in length.",
  "The bite of a Common Krait is often completely painless, causing many victims to ignore it.",
  "Saw-scaled Vipers create a loud, sizzling warning sound by rubbing their specialized serrated scales together.",
  "Green Vine Snakes have horizontal, keyhole-shaped pupils giving them incredible binocular vision.",
  "Snakes are completely deaf to airborne sounds but are highly sensitive to vibrations in the ground."
];

export default function HomePage() {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    // Start with a random fact
    setFactIdx(Math.floor(Math.random() * SNAKE_FACTS.length));

    const interval = setInterval(() => {
      setFactIdx((prev) => (prev + 1) % SNAKE_FACTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/snakes`)
      .then((response) => {
        const list = response.data.snakes || [];

        setFeatured(
          [
            list.find((s) => s.slug === "spectacled-cobra"),
            list.find((s) => s.slug === "russells-viper"),
            list.find((s) => s.slug === "green-tree-vine"),
          ].filter(Boolean)
        );
      })
      .catch(() => { });
  }, []);

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      navigate("/identify", {
        state: {
          previewUrl: url,
        },
      });
    }, 1500);
  };

  return (
    <div data-testid="home-page">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section
        className="sd-scale-pattern relative overflow-hidden gradient-hero"
      >
        {/* Floating decorative orbs */}
        <div className="orb orb-amber w-[500px] h-[500px] top-[-100px] right-[-100px] floating" />
        <div className="orb orb-green w-[300px] h-[300px] bottom-[-50px] left-[-50px]" style={{ animationDelay: "3s" }} />
        <div className="orb orb-amber w-[200px] h-[200px] top-[40%] left-[30%]" style={{ opacity: 0.5 }} />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 py-28 lg:px-8 lg:py-36 relative z-10">
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-xs font-medium text-[#E8A020] shadow-lg fade-up"
            >
              <span className="h-2 w-2 rounded-full bg-[#E8A020] pulse-red" />
              AI POWERED · TRAINED ON INDIAN SPECIES
            </span>

            <h1
              className="mt-8 font-display text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl tracking-tight fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Identify Any Snake.
              <br />
              <span className="gradient-text drop-shadow-xl inline-block mt-2">
                Instantly.
              </span>
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg text-[#D1D5DB]/90 leading-relaxed drop-shadow-md fade-up"
              style={{ animationDelay: "200ms" }}
            >
              AI-powered snake detection for India. Upload a
              photo and know in seconds if you're safe.
            </p>

            <div
              className="mt-10 flex flex-wrap gap-4 fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                to="/identify"
                className="sd-btn-primary hover-lift text-[15px] px-7 py-3.5 shadow-xl"
                data-testid="hero-identify-btn"
              >
                <Camera size={20} />
                Identify a Snake
              </Link>

              <Link
                to="/emergency"
                className="sd-btn-outline pulse-red hover-lift text-[15px] px-7 py-3.5 transition-colors hover:bg-[#C0392B]/10 hover:border-[#C0392B]"
                style={{
                  color: "#FCA5A5",
                  borderColor: "#C0392B",
                }}
                data-testid="hero-emergency-btn"
              >
                <Siren size={18} />
                Emergency Help
              </Link>
            </div>

            <div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#94A3B8] fade-up"
              style={{ animationDelay: "400ms" }}
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck
                  size={14}
                  className="text-[#E8A020]"
                />
                20+ Species Identified
              </span>

              <span className="inline-flex items-center gap-2">
                <Users
                  size={14}
                  className="text-[#E8A020]"
                />
                500+ Rescuers Registered
              </span>

              <span className="inline-flex items-center gap-2">
                <Clock
                  size={14}
                  className="text-[#E8A020]"
                />
                Available 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          AMAZING SNAKE FACTS BANNER
          ============================================ */}
      <section className="mx-auto mt-14 max-w-5xl px-4 lg:px-8 relative z-10">
        <div className="rounded-2xl border border-[#E8A020]/20 bg-gradient-to-r from-[#FDF7EC] to-[#FFFBF5] p-5 shadow-sm fade-up flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E8A020]/10 text-[#E8A020]">
            <Sparkles size={24} />
          </div>
          <div className="flex-1 overflow-hidden relative h-12 flex items-center">
            <p
              key={factIdx}
              className="font-display font-medium text-[#1A3A2A] sm:text-lg animate-slide-up-fade absolute w-full"
            >
              <span className="font-bold text-[#E8A020] mr-2">Did You Know?</span>
              {SNAKE_FACTS[factIdx]}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020]">
            How It Works
          </p>
          <h2 className="font-display text-3xl font-bold text-[#1A3A2A] sm:text-4xl mt-2">
            Three Simple Steps
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 stagger-children">
          {[
            { icon: Camera, title: "Upload Photo", desc: "Take or upload a clear photo of the snake you've spotted." },
            { icon: Zap, title: "AI Analysis", desc: "Our AI compares against 20+ Indian species in seconds." },
            { icon: Eye, title: "Get Results", desc: "Know instantly if it's venomous and get emergency guidance." },
          ].map((item, index) => (
            <div key={index} className="sd-card p-6 text-center hover-lift fade-up">
              <div className="mx-auto w-fit rounded-2xl p-4 mb-4" style={{
                background: `linear-gradient(135deg, rgba(232,160,32,${0.1 + index * 0.05}), rgba(232,160,32,${0.05 + index * 0.02}))`,
              }}>
                <item.icon className="text-[#E8A020]" size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#1A3A2A]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          FEATURED SNAKES
          ============================================ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020]">
              Featured
            </p>

            <h2 className="font-display text-3xl font-bold text-[#1A3A2A] sm:text-4xl">
              Snakes of the Week
            </h2>
          </div>

          <Link
            to="/snakes"
            className="hidden items-center gap-1 text-sm font-semibold text-[#1A3A2A] hover:text-[#E8A020] transition-colors duration-300 sm:inline-flex group"
          >
            View all snakes
            <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 stagger-children">
          {featured.map((snake) => (
            <SnakeCard
              key={snake._id || snake.slug}
              snake={snake}
            />
          ))}
        </div>
      </section>

      {/* ============================================
          EMERGENCY BANNER
          ============================================ */}
      <Link
        to="/emergency"
        className="block w-full py-6 text-center font-bold transition-all duration-500 hover:brightness-110 hover:-translate-y-1 shadow-xl text-[#1c1c1c] text-lg uppercase tracking-wide relative overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #E8A020, #f3b94a, #E8A020)",
          backgroundSize: "200% auto",
        }}
        data-testid="home-emergency-banner"
      >
        <div className="absolute inset-0 shimmer opacity-50" />
        <span className="relative z-10">
          <Siren
            className="mr-3 inline-block pulse-red"
            size={22}
          />
          Been bitten? Don't panic. Follow these steps
          immediately →
        </span>
      </Link>

      {/* ============================================
          RESCUER CTA SECTION
          ============================================ */}
      <section
        className="sd-scale-pattern py-28 relative overflow-hidden gradient-hero"
      >
        <div className="orb orb-amber w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="orb orb-green w-60 h-60 top-10 right-10" />
        <div className="orb orb-amber w-40 h-40 bottom-10 left-20" />

        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-medium text-[#E8A020] mb-6 fade-up">
            <Heart size={12} className="fill-[#E8A020]" />
            JOIN THE COMMUNITY
          </div>

          <h2 className="font-display text-3xl font-extrabold text-white sm:text-5xl fade-up" style={{ animationDelay: "100ms" }}>
            Are you a Snake Rescuer?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[1.1rem] text-[#D1D5DB]/90 leading-relaxed fade-up" style={{ animationDelay: "200ms" }}>
            Register on SarpDrishti and help people in
            your district — turn your expertise into
            lives saved.
          </p>

          <Link
            to="/rescuer/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-[#1A3A2A] transition-all duration-500 hover-lift hover:shadow-2xl group fade-up"
            style={{ animationDelay: "300ms" }}
            data-testid="rescuer-register-cta"
          >
            <span className="bg-gradient-to-r from-[#1A3A2A] to-[#2C5742] bg-clip-text text-transparent group-hover:from-[#E8A020] group-hover:to-[#f3b94a] transition-all duration-500">
              Register as Rescuer
            </span>
            <ChevronRight size={20} className="text-[#1A3A2A] group-hover:text-[#E8A020] transition-all duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}