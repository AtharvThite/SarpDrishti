import { useEffect, useState } from "react";
import axios from "axios";
import { Siren, Check, X, Phone, MapPin, Hospital, Search, Clock, Pill, RefreshCw } from "lucide-react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const BIG_FOUR = [
  { id: "cobra", name: "Indian Cobra", type: "Neurotoxic", symptoms: "Drooping eyelids, difficulty swallowing, paralysis, breathing trouble within 1-3 hours.", treatment: "Polyvalent ASV. Maintain airway. Ventilator support may be needed." },
  { id: "krait", name: "Common Krait", type: "Neurotoxic (nocturnal)", symptoms: "Bites often PAINLESS — felt only during sleep. Abdominal pain, ptosis, paralysis.", treatment: "Critical: anyone waking with unexplained paralysis should be rushed to hospital with ASV." },
  { id: "russell", name: "Russell's Viper", type: "Hemotoxic", symptoms: "Severe pain, rapid local swelling, bleeding from gums/urine, kidney failure.", treatment: "Polyvalent ASV, blood transfusion, dialysis may be required." },
  { id: "saw", name: "Saw-scaled Viper", type: "Hemotoxic", symptoms: "Swelling, bleeding disorders, blistering. Responsible for most snakebite deaths in India.", treatment: "Polyvalent ASV. Watch for systemic bleeding for 48-72 hours." },
];

const formatTime = (seconds) => {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export default function EmergencyPage() {
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

  const activeSnake = BIG_FOUR.find((s) => s.id === tab);

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
          <h1 className="font-display text-3xl font-bold sm:text-5xl">Emergency Guide</h1>
          <p className="mt-3 text-lg text-white/80">Snake Bite First Aid · Stay calm, act fast.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Timer */}
        <div className="sd-card p-8 text-center fade-up relative overflow-visible" data-testid="bite-timer">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#C0392B]">Bite Timer</p>
          <p className="mt-2 text-[#6B7280]">Time is critical. Antivenom is most effective within 1–2 hours.</p>
          <p className="my-6 font-mono text-6xl font-bold sm:text-7xl transition-colors duration-500" style={{ color: running ? "#C0392B" : "#1A3A2A" }} data-testid="timer-display">
            {formatTime(seconds)}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!running ? (
              <button onClick={() => setRunning(true)} className="sd-btn-danger pulse-red"><Clock size={16} /> Start Timer</button>
            ) : (
              <button onClick={() => setRunning(false)} className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white shadow-md hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg, #1A3A2A, #2C5742)" }}>Pause</button>
            )}
            <button onClick={() => { setRunning(false); setSeconds(0); }} className="inline-flex items-center gap-2 rounded-xl border-2 border-[#6B7280] px-5 py-2 font-semibold text-[#6B7280] hover:bg-[#6B7280] hover:text-white transition-all duration-300">Reset</button>
          </div>
        </div>

        {/* DO / DON'T */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 stagger-children">
          <div className="sd-card overflow-hidden fade-up">
            <div className="px-5 py-3.5 font-display text-lg font-semibold text-white" style={{ background: "linear-gradient(135deg, #27AE60, #2ecc71)" }}>
              <Check className="mr-2 inline" size={18} /> DO
            </div>
            <ul className="space-y-3 p-5 text-sm">
              {["Stay calm — panic increases venom spread", "Immobilize the bitten limb below heart level", "Remove rings, watches, tight clothing immediately", "Note the snake's appearance (or photograph if safe)", "Get to the nearest government hospital fast"].map((item, i) => (
                <li key={i} className="flex gap-2 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <Check size={14} className="mt-0.5 shrink-0 text-[#27AE60]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="sd-card overflow-hidden fade-up" style={{ animationDelay: "100ms" }}>
            <div className="px-5 py-3.5 font-display text-lg font-semibold text-white" style={{ background: "linear-gradient(135deg, #C0392B, #e04835)" }}>
              <X className="mr-2 inline" size={18} /> DON&apos;T
            </div>
            <ul className="space-y-3 p-5 text-sm">
              {["Cut the wound or try to suck out venom", "Apply a tourniquet — it causes tissue death", "Apply ice or any heat to the bite", "Give alcohol, painkillers or aspirin", "Waste time on local remedies or healers"].map((item, i) => (
                <li key={i} className="flex gap-2 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <X size={14} className="mt-0.5 shrink-0 text-[#C0392B]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big Four */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">Snake-Specific First Aid · The Big Four</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {BIG_FOUR.map((snake) => (
              <button key={snake.id} onClick={() => setTab(snake.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${tab === snake.id ? "text-white shadow-md" : "bg-white text-[#1c1c1c] hover:bg-black/5"}`}
                style={tab === snake.id ? { background: "linear-gradient(135deg, #1A3A2A, #2C5742)" } : {}}>
                {snake.name}
              </button>
            ))}
          </div>
          {activeSnake && (
            <div className="sd-card mt-4 p-6 fade-up" key={activeSnake.id}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C0392B]">{activeSnake.type}</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-[#1A3A2A]">{activeSnake.name}</h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(192,57,43,0.05), rgba(192,57,43,0.02))" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Symptoms</p>
                  <p className="mt-1 text-sm">{activeSnake.symptoms}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(39,174,96,0.05), rgba(39,174,96,0.02))" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Treatment</p>
                  <p className="mt-1 text-sm">{activeSnake.treatment}</p>
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
              <p className="font-display text-xl font-bold text-[#1A3A2A]">India uses Polyvalent Anti-Snake Venom (ASV) covering the Big Four</p>
              <p className="mt-1 font-semibold text-[#27AE60]">Available FREE at Government Hospitals.</p>
            </div>
          </div>
        </div>

        {/* Hospital Finder */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold text-[#1A3A2A]">Find Nearest Hospital</h2>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[#6B7280]">
              Snakebite victims must be rushed to a government hospital equipped with Anti-Snake Venom (ASV).
            </p>
            <button 
              onClick={fetchLocation} 
              disabled={locating}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#E8A020] hover:text-[#C88A1A] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={locating ? "animate-spin" : ""} />
              Refresh Location
            </button>
          </div>
          
          <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E0D2] shadow-sm relative bg-[#F7F4EF]">
            {locating ? (
              <div className="flex h-[400px] flex-col items-center justify-center text-[#6B7280]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8A020] border-t-transparent mb-4"></div>
                <p className="font-semibold">Locating you...</p>
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
              <MapPin size={18} /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}