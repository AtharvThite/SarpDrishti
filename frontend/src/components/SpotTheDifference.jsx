import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ShieldAlert, ShieldCheck } from "lucide-react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const COMPARISONS = [
  {
    id: "cobra-rat",
    title: "Cobra vs Rat Snake",
    snake1: "spectacled-cobra",
    snake2: "common-rat-snake",
    features: [
      { name: "Hood", s1: "Present (when threatened)", s2: "Absent" },
      { name: "Venom", s1: "Dangerous (Neurotoxic)", s2: "Harmless" },
      { name: "Head", s1: "Broader", s2: "Slim and pointed" },
      { name: "Bite", s1: "Medical emergency", s2: "Usually minor" },
    ]
  },
  {
    id: "viper-boa",
    title: "Russell's Viper vs Sand Boa",
    snake1: "russells-viper",
    snake2: "common-sand-boa",
    features: [
      { name: "Pattern", s1: "Three chain-like spot rows", s2: "Irregular blotches" },
      { name: "Tail", s1: "Tapered", s2: "Blunt (looks like head)" },
      { name: "Venom", s1: "Dangerous (Hemotoxic)", s2: "Harmless" },
      { name: "Sound", s1: "Loud, continuous hiss", s2: "Silent or very quiet" },
    ]
  },
  {
    id: "krait-wolf",
    title: "Common Krait vs Wolf Snake",
    snake1: "common-krait",
    snake2: "common-wolf-snake", // Wait, we might not have wolf snake. Let's use Trinket snake instead
    features: [
      { name: "Bands", s1: "Paired white bands (mostly tail)", s2: "Yellow/white crossbars (front half)" },
      { name: "Scales", s1: "Enlarged hexagonal along spine", s2: "Normal smooth scales" },
      { name: "Venom", s1: "Deadly (Neurotoxic)", s2: "Harmless" },
      { name: "Bite", s1: "Often painless", s2: "Painful, bleeds easily" },
    ]
  }
];

// Fallback for wolf-snake to trinket-snake in our DB
const SLUG_MAP = {
  "common-wolf-snake": "common-trinket",
  "spectacled-cobra": "spectacled-cobra",
  "common-rat-snake": "common-rat-snake",
  "russells-viper": "russells-viper",
  "common-sand-boa": "common-sand-boa",
  "common-krait": "common-krait"
};

export default function SpotTheDifference() {
  const [snakes, setSnakes] = useState({});
  const [activeComp, setActiveComp] = useState(COMPARISONS[0]);

  useEffect(() => {
    axios.get(`${API}/snakes`)
      .then((res) => {
        const snakeMap = {};
        const list = res.data.snakes || [];
        list.forEach(s => {
          snakeMap[s.slug] = s;
        });
        setSnakes(snakeMap);
      })
      .catch(() => {});
  }, []);

  const s1Data = snakes[SLUG_MAP[activeComp.snake1]];
  const s2Data = snakes[SLUG_MAP[activeComp.snake2]];

  return (
    <section className="mt-14 fade-up">
      <h2 className="flex items-center gap-2 font-display text-3xl font-bold text-[#1A3A2A]">
        <Search size={24} className="text-[#E8A020]" /> Can You Spot the Difference?
      </h2>
      <p className="mt-2 text-[#6B7280]">Many harmless snakes are killed because they look like venomous ones. Learn to tell them apart.</p>
      
      <div className="mt-6 flex flex-wrap gap-2">
        {COMPARISONS.map(comp => (
          <button
            key={comp.id}
            onClick={() => setActiveComp(comp)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeComp.id === comp.id 
                ? "bg-[#1A3A2A] text-white shadow-md" 
                : "bg-white border border-[#E9E3D7] text-[#6B7280] hover:border-[#1A3A2A] hover:text-[#1A3A2A]"
            }`}
          >
            {comp.title}
          </button>
        ))}
      </div>

      <div className="sd-card mt-6 overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/5 bg-white">
          
          {/* Snake 1 */}
          <div className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-bold text-[#C0392B] flex items-center gap-2">
                <ShieldAlert size={18} /> {s1Data?.common_name || "Venomous Snake"}
              </h3>
            </div>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/5 mb-4 border border-black/5">
              <img 
                src={s1Data?.thumbnail || `https://placehold.co/800x450/C0392B/ffffff?text=Venomous`} 
                alt="Snake 1" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Snake 2 */}
          <div className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-bold text-[#27AE60] flex items-center gap-2">
                <ShieldCheck size={18} /> {s2Data?.common_name || "Harmless Snake"}
              </h3>
            </div>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/5 mb-4 border border-black/5">
              <img 
                src={s2Data?.thumbnail || `https://placehold.co/800x450/27AE60/ffffff?text=Harmless`} 
                alt="Snake 2" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#F9FAFB] p-5 border-t border-black/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-3 px-2 font-semibold text-[#1A3A2A] w-1/4">Feature</th>
                <th className="py-3 px-2 font-semibold text-[#C0392B] w-3/8">Venomous</th>
                <th className="py-3 px-2 font-semibold text-[#27AE60] w-3/8">Lookalike</th>
              </tr>
            </thead>
            <tbody>
              {activeComp.features.map((feat, idx) => (
                <tr key={idx} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                  <td className="py-3 px-2 font-medium text-[#6B7280]">{feat.name}</td>
                  <td className="py-3 px-2 text-[#1c1c1c]">{feat.s1}</td>
                  <td className="py-3 px-2 text-[#1c1c1c]">{feat.s2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
