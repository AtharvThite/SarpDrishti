import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Search, Locate, Heart, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import RescuerCard from "../components/RescuerCard";

const RESCUE_STORIES = [
  { icon: Shield, color: "#27AE60", bg: "rgba(39,174,96,0.1)" },
  { icon: Award, color: "#E8A020", bg: "rgba(232,160,32,0.1)" },
  { icon: Heart, color: "#C0392B", bg: "rgba(192,57,43,0.1)" },
  { icon: Shield, color: "#27AE60", bg: "rgba(39,174,96,0.1)" },
  { icon: Award, color: "#C0392B", bg: "rgba(192,57,43,0.1)" },
  { icon: Heart, color: "#E8A020", bg: "rgba(232,160,32,0.1)" }
];

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function RescuersPage() {
  const { t, i18n } = useTranslation();
  const [rescuers, setRescuers] = useState([]);
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const [storyIdx, setStoryIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStoryIdx((prev) => (prev + 1) % RESCUE_STORIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRescuers = async (districtName = "") => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/rescuers`,
        {
          params: {
             ...(districtName ? { district: districtName } : {}),
             lang: i18n.language
          }
        }
      );

      setRescuers(
        response.data.rescuers || []
      );
    } catch (error) {
      console.error(error);
      setRescuers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescuers();
  }, [i18n.language]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setDistrict("Mumbai");
        fetchRescuers("Mumbai");
      },
      () => {
        setDistrict("Mumbai");
        fetchRescuers("Mumbai");
      }
    );
  };

  return (
    <div data-testid="rescuers-page">
      <header
        className="sd-scale-pattern py-14"
        style={{
          background:
            "linear-gradient(135deg, #1A3A2A 0%, #0F2318 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020]">
            {t('rescuers.label')}
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            {t('rescuers.title')}
          </h1>

          <p className="mt-3 max-w-2xl text-[#D1D5DB]">
            {t('rescuers.subtitle')}
          </p>
        </div>
      </header>

      {/* ============================================
          RESCUE STORIES
          ============================================ */}
      <section className="mx-auto mt-10 max-w-3xl px-4 lg:px-8 fade-up">
        <h2 className="font-display text-2xl font-bold text-[#1A3A2A] mb-5 text-center">{t('rescuers.heroStoriesTitle')}</h2>
        <div className="relative overflow-hidden rounded-2xl border border-black/5 p-6 md:p-8" style={{ background: "linear-gradient(to bottom right, #ffffff, #F9FAFB)" }}>
          {RESCUE_STORIES.map((story, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col md:flex-row items-center md:items-start gap-6 transition-all duration-500 absolute inset-0 p-6 md:p-8 w-full h-full ${idx === storyIdx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
            >
              <div className="w-16 h-16 shrink-0 rounded-full grid place-items-center mb-4 md:mb-0" style={{ backgroundColor: story.bg, color: story.color }}>
                <story.icon size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-xl font-bold text-[#1c1c1c] mb-3">{t(`rescuers.story${idx + 1}_title`)}</h3>
                <p className="text-base text-[#6B7280] leading-relaxed">{t(`rescuers.story${idx + 1}_text`)}</p>
              </div>
            </div>
          ))}
          {/* Spacer to give the absolute container height */}
          <div className="invisible flex flex-col md:flex-row items-center md:items-start gap-6">
             <div className="w-16 h-16 shrink-0 mb-4 md:mb-0" />
             <div className="flex-1">
               <h3 className="font-display text-xl font-bold mb-3">Placeholder</h3>
               <p className="text-base leading-relaxed">This is placeholder text to ensure the container is tall enough for the longest possible story. It should wrap onto three lines on mobile screens just to be absolutely certain it doesn't clip content during transitions.</p>
             </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {RESCUE_STORIES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setStoryIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === storyIdx ? 'w-8 bg-[#1A3A2A]' : 'w-2 bg-[#E5E0D2]'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-[#1A3A2A] mb-5">{t('rescuers.findRescuer')}</h2>
        <div className="sd-card flex flex-wrap gap-2 p-4">
          <div className="relative min-w-[200px] flex-1">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />

            <input
              value={district}
              onChange={(e) =>
                setDistrict(e.target.value)
              }
              placeholder={t('rescuers.searchPlaceholder')}
              className="w-full rounded-lg border border-[#E5E0D2] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#1A3A2A] focus:outline-none"
              data-testid="rescuer-search-input"
            />
          </div>

          <button
            onClick={useMyLocation}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1A3A2A] px-4 py-2 text-sm font-semibold text-[#1A3A2A] hover:bg-[#1A3A2A] hover:text-white"
            data-testid="use-location-btn"
          >
            <Locate size={14} />
            {t('rescuers.useMyLocation')}
          </button>

          <button
            onClick={() =>
              fetchRescuers(district)
            }
            className="sd-btn-primary"
            data-testid="search-rescuers-btn"
          >
            <Search size={14} />
            {t('rescuers.search')}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p
            className="text-sm text-[#6B7280]"
            data-testid="rescuer-count"
          >
            {rescuers.length} {t('rescuers.rescuersFound')}
          </p>

          <Link
            to="/rescuer/register"
            className="text-sm font-semibold text-[#1A3A2A] hover:underline"
          >
            {t('rescuers.registerPrompt')}
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-[#6B7280]">
            {t('rescuers.loading')}
          </p>
        ) : (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rescuers.map((rescuer) => (
              <RescuerCard
                key={rescuer._id}
                rescuer={rescuer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}