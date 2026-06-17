import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Camera, Upload, AlertTriangle, ShieldCheck, Phone, ChevronDown, ChevronUp, Sparkles, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfidenceBar from "../components/ConfidenceBar";
import FirstAidStep from "../components/FirstAidStep";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function IdentifyPage() {
  const location = useLocation();
  const [preview, setPreview] = useState(location.state?.previewUrl || null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [openAid, setOpenAid] = useState(true);
  const [openAbout, setOpenAbout] = useState(false);

  useEffect(() => {
    if (location.state?.previewUrl && !result) { analyze(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const analyze = async () => {
    setLoading(true); setResult(null);
    try {
      const blob = await fetch(preview).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image", blob, "upload.jpg");

      const response = await axios.post(`${API}/identify`, formData);
      setResult(response.data.snake);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8" data-testid="identify-page">
      <div className="mb-8 fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020] inline-flex items-center gap-2">
          <Sparkles size={14} /> AI Identification
        </p>
        <h1 className="font-display text-4xl font-bold text-[#1A3A2A] sm:text-5xl mt-1">Identify a Snake</h1>
        <p className="mt-2 max-w-2xl text-[#6B7280]">Upload a clear photo of the snake. Our AI compares it against 20+ Indian species in seconds.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="sd-card p-6 fade-up" style={{ animationDelay: "100ms" }}>
          <label htmlFor="upload-input"
            className="block cursor-pointer rounded-xl border-2 border-dashed border-[#E8A020]/40 bg-gradient-to-br from-[#FDF7EC] via-white to-[#FDF7EC] p-6 text-center transition-all duration-500 hover:from-[#FCEFD2] hover:to-[#FDF7EC] hover:border-[#E8A020] hover:shadow-[inset_0_2px_20px_rgba(232,160,32,0.1)] group"
            data-testid="upload-area">
            {preview ? (
              <img src={preview} alt="preview" className="mx-auto max-h-72 rounded-xl shadow-lg" />
            ) : (
              <div className="py-10">
                <div className="mx-auto w-fit rounded-2xl bg-gradient-to-br from-[#E8A020]/10 to-[#E8A020]/5 p-5 transition-all duration-300 group-hover:scale-110">
                  <Camera className="text-[#1A3A2A] group-hover:text-[#E8A020] transition-colors duration-300" size={44} />
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-[#1A3A2A] group-hover:text-[#E8A020] transition-colors">Drag & drop a snake photo</p>
                <p className="mt-1 text-sm text-[#6B7280]">JPG, PNG, WEBP up to 10MB</p>
              </div>
            )}
            <input id="upload-input" type="file" accept="image/*" className="hidden" onChange={handleFile} data-testid="upload-input" />
          </label>

          <div className="mt-4 flex flex-wrap gap-3">
            <label htmlFor="upload-input"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #1A3A2A, #2C5742)" }} data-testid="browse-files-btn">
              <Upload size={16} /> Browse Files
            </label>
            <label htmlFor="upload-camera"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#1A3A2A]/20 hover:bg-[#1A3A2A] hover:text-white px-4 py-2 text-sm font-bold text-[#1A3A2A] transition-all duration-300"
              data-testid="take-photo-btn">
              <Camera size={16} /> Take Photo
            </label>
            <input id="upload-camera" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          </div>

          <button onClick={analyze} disabled={!preview || loading}
            className="sd-btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50 text-base py-3" data-testid="analyze-btn">
            {loading ? "Analyzing..." : "Analyze This Snake"}
          </button>
        </div>

        <div data-testid="results-panel">
          {loading && (
            <div className="sd-card flex h-full min-h-[300px] items-center justify-center">
              <LoadingSpinner label="Analyzing with AI..." />
            </div>
          )}
          {!loading && !result && (
            <div className="sd-card flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center fade-up" style={{ animationDelay: "200ms" }}>
              <div className="grid h-20 w-20 place-items-center rounded-2xl glow-pulse" style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.15), rgba(232,160,32,0.05))" }}>
                <Camera className="text-[#E8A020]" size={32} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-[#1A3A2A]">Awaiting your photo</h3>
              <p className="mt-2 max-w-xs text-sm text-[#6B7280]">Upload an image and hit Analyze to get instant identification.</p>
            </div>
          )}
          {!loading && result && (
            <div className="overflow-hidden rounded-2xl shadow-xl fade-up" data-testid="identification-result">
              {result.is_venomous ? (
                <div className="flex items-center gap-3 px-5 py-4 text-sm font-bold uppercase tracking-wider text-white pulse-red" style={{ background: "linear-gradient(135deg, #C0392B, #e04835)" }} data-testid="result-venomous-banner">
                  <AlertTriangle size={18} /> Venomous — Seek Help Immediately
                </div>
              ) : (
                <div className="flex items-center gap-3 px-5 py-4 text-sm font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg, #27AE60, #2ecc71)" }} data-testid="result-safe-banner">
                  <ShieldCheck size={18} /> Non-Venomous — You are likely safe
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 bg-gradient-to-r from-[#FFF5F2] to-[#fff0ed] p-4">
                <Link to="/rescuers" className="sd-btn-danger" data-testid="result-call-rescuer"><Phone size={16} /> Call Rescuer</Link>
                <Link to="/emergency" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#C0392B] ring-2 ring-[#C0392B] transition-all hover:bg-[#C0392B] hover:text-white" data-testid="result-find-hospital">Emergency Guide</Link>
              </div>
              <div className="bg-white p-5">
                <div className="flex items-start gap-4">
                  <img src={result.thumbnail} alt={result.common_name} className="h-20 w-20 shrink-0 rounded-xl object-cover shadow-md" onError={(e) => { e.currentTarget.src = "https://placehold.co/120x120/1A3A2A/ffffff?text=Snake"; }} />
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-[#1c1c1c]">{result.common_name}</h3>
                    <p className="font-mono text-sm italic text-[#6B7280]">{result.scientific_name}</p>
                    {result.venom_type && <p className="mt-1 text-xs font-medium text-[#C0392B]">Venom: {result.venom_type}</p>}
                    <div className="mt-3"><ConfidenceBar value={result.confidence} /></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-black/5 bg-white">
                <button onClick={() => setOpenAid((v) => !v)} className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-semibold uppercase tracking-wider text-[#1A3A2A] hover:bg-black/[0.02] transition-colors">
                  Immediate First Aid {openAid ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAid && <div className="space-y-2.5 px-5 pb-5 slide-down">{(result.first_aid || []).map((step, i) => <FirstAidStep key={i} number={i + 1} text={step} danger={result.is_venomous} />)}</div>}
              </div>
              <div className="border-t border-black/5 bg-white">
                <button onClick={() => setOpenAbout((v) => !v)} className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-semibold uppercase tracking-wider text-[#1A3A2A] hover:bg-black/[0.02] transition-colors">
                  About this Snake {openAbout ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAbout && (
                  <div className="space-y-3 px-5 pb-5 text-sm slide-down">
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Habitat</p><p>{(result.habitat || []).join(", ")}</p></div>
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Distribution</p><p>{(result.distribution || []).join(", ")}</p></div>
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Size</p><p className="font-mono">{result.size_range_cm?.min}-{result.size_range_cm?.max} cm</p></div>
                  </div>
                )}
              </div>
              <div className="bg-[#F9FAFB] p-5 border-t border-black/5">
                <Link to={`/snakes/${result.slug}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A3A2A] px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#2C5742] hover:shadow-lg hover:-translate-y-0.5">
                  View Full Snake Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}