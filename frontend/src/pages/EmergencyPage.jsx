import { useEffect, useState } from "react";
import axios from "axios";
import { Siren, Check, X, Phone, MapPin, Hospital, Search, Clock, Pill, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const BIG_FOUR = ["cobra", "krait", "russell", "saw"];

const formatTime = (seconds) => {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export default function EmergencyPage() {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState("cobra");
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(true);

  const fetchLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocating(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const activeSnake = tab;

  return (
    <div data-testid="emergency-page">
      {/* Hero */}
      <section className="py-12 text-center text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #C0392B 0%, #8E2A1F 50%, #7d2319 100%)" }}>
        <div className="orb orb-red w-80 h-80 top-[-100px] right-[-50px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="mx-auto max-w-5xl px-4 lg:px-8 relative z-10 fade-up">
          <div className="mx-auto w-fit rounded-2xl bg-white/10 p-3 mb-4 backdrop-blur-sm">
            <Siren className="mx-auto" size={36} />
          </div>
          <h1 className="font-display text-3xl font-bold sm:text-5xl">{t('emergency.title')}</h1>
          <p className="mt-3 text-lg text-white/80">{t('emergency.subtitle')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Timer */}
        <div className="sd-card p-8 text-center fade-up relative overflow-visible" data-testid="bite-timer">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C0392B]">{t('emergency.timerTitle')}</p>
          <p className="mt-2 text-[#6B7280]">{t('emergency.timerDesc')}</p>
          <p className="my-6 font-mono text-6xl font-bold sm:text-7xl transition-colors duration-500" style={{ color: running ? "#C0392B" : "#1A3A2A" }} data-testid="timer-display">
            {formatTime(seconds)}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!running ? (
              <button onClick={() => setRunning(true)} className="sd-btn-danger pulse-red"><Clock size={16} /> {t('emergency.startTimer')}</button>
            ) : (
              <button onClick={() => setRunning(false)} className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white shadow-md hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #1A3A2A, #2C5742)" }}>{t('emergency.pause')}</button>
            )}
            <button onClick={() => { setRunning(false); setSeconds(0); }} className="inline-flex items-center gap-2 rounded-xl border-2 border-[#6B7280] px-5 py-2 font-semibold text-[#6B7280] hover:bg-[#6B7280] hover:text-white transition-all duration-300">{t('emergency.reset')}</button>
          </div>
        </div>

        {/* DO / DON'T */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 stagger-children">
          <div className="sd-card overflow-hidden fade-up">
            <div className="px-5 py-3.5 font-display text-lg font-semibold text-white" style={{ background: "linear-gradient(135deg, #27AE60, #2ecc71)" }}>
              <Check className="mr-2 inline" size={18} /> {t('emergency.do')}
            </div>
            <ul className="space-y-3 p-5 text-sm">
              {[t('emergency.do1'), t('emergency.do2'), t('emergency.do3'), t('emergency.do4'), t('emergency.do5')].map((item, i) => (
                <li key={i} className="flex gap-2 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <Check size={14} className="mt-0.5 shrink-0 text-[#27AE60]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="sd-card overflow-hidden fade-up" style={{ animationDelay: "100ms" }}>
            <div className="px-5 py-3.5 font-display text-lg font-semibold text-white" style={{ background: "linear-gradient(135deg, #C0392B, #e04835)" }}>
              <X className="mr-2 inline" size={18} /> {t('emergency.dont')}
            </div>
            <ul className="space-y-3 p-5 text-sm">
              {[t('emergency.dont1'), t('emergency.dont2'), t('emergency.dont3'), t('emergency.dont4'), t('emergency.dont5')].map((item, i) => (
                <li key={i} className="flex gap-2 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <X size={14} className="mt-0.5 shrink-0 text-[#C0392B]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big Four */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">{t('emergency.bigFourTitle')}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {BIG_FOUR.map((snakeId) => (
              <button key={snakeId} onClick={() => setTab(snakeId)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${tab === snakeId ? "text-white shadow-md" : "bg-white text-[#1c1c1c] hover:bg-black/5"}`}
                style={tab === snakeId ? { background: "linear-gradient(135deg, #1A3A2A, #2C5742)" } : {}}>
                {t(`emergency.${snakeId}_name`)}
              </button>
            ))}
          </div>
          {activeSnake && (
            <div className="sd-card mt-4 p-6 fade-up" key={activeSnake}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C0392B]">{t(`emergency.${activeSnake}_type`)}</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-[#1A3A2A]">{t(`emergency.${activeSnake}_name`)}</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(192,57,43,0.05), rgba(192,57,43,0.02))" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{t('emergency.symptoms')}</p>
                  <p className="mt-1 text-sm">{t(`emergency.${activeSnake}_symptoms`)}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(39,174,96,0.05), rgba(39,174,96,0.02))" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{t('emergency.treatment')}</p>
                  <p className="mt-1 text-sm">{t(`emergency.${activeSnake}_treatment`)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ASV Info */}
        <div className="sd-card mt-8 p-6 fade-up" style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.05), rgba(232,160,32,0.02))" }}>
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.2), rgba(232,160,32,0.1))" }}>
              <Pill className="text-[#E8A020]" size={24} />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-[#1A3A2A]">{t('emergency.asvTitle')}</p>
              <p className="mt-1 font-semibold text-[#27AE60]">{t('emergency.asvFree')}</p>
            </div>
          </div>
        </div>

        {/* Hospital Finder */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">{t('emergency.hospitalTitle')}</h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[#6B7280]">
              {t('emergency.hospitalDesc')}
            </p>
            <button 
              onClick={fetchLocation} 
              disabled={locating}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#E8A020] hover:text-[#C88A1A] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={locating ? "animate-spin" : ""} />
              {t('emergency.refreshLocation')}
            </button>
          </div>
          
          <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E0D2] shadow-sm relative bg-[#F7F4EF]">
            {locating ? (
              <div className="flex h-[400px] flex-col items-center justify-center text-[#6B7280]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8A020] border-t-transparent mb-4"></div>
                <p className="font-semibold">{t('emergency.locating')}</p>
              </div>
            ) : (
              <iframe
                title="Nearest Government Hospitals"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={
                  location 
                    ? `https://maps.google.com/maps?q=government+hospital+near+${location.lat},${location.lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                    : "https://maps.google.com/maps?q=government+hospital+near+me&t=&z=12&ie=UTF8&iwloc=&output=embed"
                }
              ></iframe>
            )}
          </div>
          <div className="mt-6 flex justify-center fade-up">
            <a
              href={
                location
                  ? `https://www.google.com/maps/search/government+hospital/@${location.lat},${location.lng},13z`
                  : "https://www.google.com/maps/search/government+hospital+near+me"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md hover-lift transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #1A3A2A, #2C5742)" }}
            >
              <MapPin size={18} /> {t('emergency.openMaps')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}