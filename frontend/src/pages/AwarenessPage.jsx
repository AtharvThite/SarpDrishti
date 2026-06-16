import { useState } from "react";
import { ChevronDown, RotateCw, Sparkles, Cloud, Sun, Trophy, AlertCircle } from "lucide-react";

const MYTHS = [
  { myth: "Cobras are attracted to milk and music.", fact: "False. Snakes cannot digest milk and are deaf to airborne sounds — they react to movement, not music." },
  { myth: "All snakes are venomous.", fact: "False. Of ~300 snake species in India, only about 60 are venomous and only ~15 are medically significant." },
  { myth: "You should suck out the venom after a bite.", fact: "False and dangerous. This can introduce infection. Immobilize the limb and get to a hospital immediately." },
  { myth: "Snakes attack people unprovoked.", fact: "Snakes prefer to flee. Most bites are defensive when the snake feels threatened." },
  { myth: 'A two-headed snake (Sand Boa) has supernatural powers.', fact: "False. The Red Sand Boa has a blunt tail resembling a head. Myths fuel illegal wildlife trade." },
];

const MONTHS = [
  { m: "Jan", risk: "low" }, { m: "Feb", risk: "low" }, { m: "Mar", risk: "med" },
  { m: "Apr", risk: "med" }, { m: "May", risk: "med" }, { m: "Jun", risk: "high" },
  { m: "Jul", risk: "high" }, { m: "Aug", risk: "high" }, { m: "Sep", risk: "high" },
  { m: "Oct", risk: "med" }, { m: "Nov", risk: "low" }, { m: "Dec", risk: "low" },
];

const BEHAVIORS = [
  { t: "Stop & Stay Still", d: "Sudden movement can trigger defensive behavior. Freeze and back away slowly." },
  { t: "Give Wide Berth", d: "Keep at least 2 metres away. Most snakes retreat if left alone." },
  { t: "Don't Try to Handle", d: "Even injured or apparently dead snakes can bite. Never attempt handling." },
  { t: "Call a Verified Rescuer", d: "Contact a trained rescuer rather than trying to kill or move the snake yourself." },
];

const QUIZ = [
  { q: "Which snake bite is often painless and may be noticed only during sleep?", options: ["Russell's Viper", "Common Krait", "Indian Cobra", "Green Vine Snake"], a: 1 },
  { q: "What should you do first after a snake bite?", options: ["Suck out the venom", "Apply a tourniquet", "Stay calm and immobilize the limb", "Drink alcohol"], a: 2 },
  { q: "How many snakes make up India's Big Four?", options: ["3", "4", "5", "6"], a: 1 },
  { q: "Where is anti-snake venom commonly available free of cost?", options: ["Private clinics only", "Government hospitals", "Veterinary centres", "Medical stores"], a: 1 },
  { q: "Which snake is non-venomous and often confused with a cobra?", options: ["Saw-scaled Viper", "Indian Rat Snake", "King Cobra", "Common Krait"], a: 1 },
];

export default function AwarenessPage() {
  const [openMyth, setOpenMyth] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const score = answers.reduce((t, a, i) => t + (a === QUIZ[i].a ? 1 : 0), 0);

  const answerQuestion = (answerIndex) => {
    const next = [...answers, answerIndex];
    setAnswers(next);
    if (next.length === QUIZ.length) setShowResult(true);
    else setQuizIdx((p) => p + 1);
  };

  const resetQuiz = () => { setAnswers([]); setQuizIdx(0); setShowResult(false); };

  return (
    <div data-testid="awareness-page">
      <header className="sd-scale-pattern py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3A2A 0%, #0F2318 50%, #14281d 100%)" }}>
        <div className="orb orb-amber w-80 h-80 top-[-80px] right-[-40px]" />
        <div className="orb orb-green w-60 h-60 bottom-[-40px] left-[-20px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020] fade-up">Learn</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl fade-up" style={{ animationDelay: "100ms" }}>Snake Awareness</h1>
          <p className="mt-3 max-w-2xl text-[#D1D5DB]/90 fade-up" style={{ animationDelay: "200ms" }}>Knowledge saves lives. Bust myths, understand seasonal risk, and learn how to live safely alongside snakes.</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        {/* Myths */}
        <section>
          <h2 className="font-display text-3xl font-bold text-[#1A3A2A] fade-up">Common Myths vs Facts</h2>
          <div className="mt-5 space-y-3 stagger-children">
            {MYTHS.map((item, index) => (
              <div key={index} className="sd-card overflow-hidden fade-up">
                <button type="button" onClick={() => setOpenMyth(openMyth === index ? -1 : index)}
                  className="flex w-full items-start justify-between gap-3 p-5 text-left hover:bg-black/[0.01] transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #C0392B, #e04835)" }}>
                      <AlertCircle size={14} />
                    </span>
                    <p className="font-display text-lg font-semibold">{item.myth}</p>
                  </div>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${openMyth === index ? "rotate-180" : ""}`} />
                </button>
                {openMyth === index && (
                  <div className="flex gap-3 border-t border-black/5 p-5 slide-down" style={{ background: "linear-gradient(135deg, rgba(39,174,96,0.05), rgba(39,174,96,0.02))" }}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #27AE60, #2ecc71)" }}>✓</span>
                    <p>{item.fact}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Snake Season */}
        <section className="mt-14 fade-up">
          <h2 className="font-display text-3xl font-bold text-[#1A3A2A]">Snake Season in India</h2>
          <p className="mt-2 text-[#6B7280]">Bite incidents peak during monsoon months when snakes are displaced from their shelters.</p>
          <div className="sd-card mt-5 p-6">
            <div className="flex items-end gap-1.5">
              {MONTHS.map((month) => {
                const height = month.risk === "high" ? 80 : month.risk === "med" ? 50 : 24;
                const gradient = month.risk === "high" ? "linear-gradient(180deg, #C0392B, #e04835)" : month.risk === "med" ? "linear-gradient(180deg, #E8A020, #f3b94a)" : "linear-gradient(180deg, #27AE60, #2ecc71)";
                return (
                  <div key={month.m} className="flex flex-1 flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg animate-bar-grow transition-all duration-300 hover:brightness-110" style={{ height, background: gradient, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
                    <span className="text-xs text-[#6B7280] font-medium">{month.m}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg, #27AE60, #2ecc71)" }} /> Low risk</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg, #E8A020, #f3b94a)" }} /> Moderate</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: "linear-gradient(135deg, #C0392B, #e04835)" }} /> High risk</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#6B7280]">
              <span className="inline-flex items-center gap-1"><Sun size={14} className="text-[#E8A020]" /> Summer</span>
              <span className="inline-flex items-center gap-1"><Cloud size={14} className="text-[#1A3A2A]" /> Monsoon Peak</span>
            </div>
          </div>
        </section>

        {/* Behaviors */}
        <section className="mt-14">
          <h2 className="font-display text-3xl font-bold text-[#1A3A2A] fade-up">How to Behave Around Snakes</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 stagger-children">
            {BEHAVIORS.map((item, index) => (
              <div key={index} className="sd-card p-5 hover-lift fade-up">
                <div className="grid h-11 w-11 place-items-center rounded-2xl font-mono font-bold text-white" style={{ background: "linear-gradient(135deg, #E8A020, #f3b94a)", boxShadow: "0 4px 12px rgba(232,160,32,0.3)" }}>
                  {index + 1}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#1A3A2A]">{item.t}</h3>
                <p className="mt-1 text-sm text-[#6B7280]">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz */}
        <section className="mt-14 fade-up">
          <h2 className="flex items-center gap-2 font-display text-3xl font-bold text-[#1A3A2A]">
            <Sparkles size={22} className="text-[#E8A020]" /> Quick Quiz
          </h2>
          <div className="sd-card mt-5 p-6" style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.03), rgba(255,255,255,1))" }}>
            {showResult ? (
              <div className="text-center fade-up">
                <div className="mx-auto w-fit rounded-2xl p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.15), rgba(232,160,32,0.05))" }}>
                  <Trophy size={40} className="text-[#E8A020]" />
                </div>
                <p className="font-mono text-sm uppercase tracking-wider text-[#E8A020]">Your Score</p>
                <p className="my-3 font-display text-6xl font-bold gradient-text">{score} / {QUIZ.length}</p>
                <p className="text-sm text-[#6B7280] mb-4">{score >= 4 ? "Excellent! You're well prepared." : score >= 2 ? "Good job! Keep learning." : "Review the guide above and try again!"}</p>
                <button onClick={resetQuiz} className="sd-btn-primary"><RotateCw size={14} /> Retake Quiz</button>
              </div>
            ) : (
              <div className="fade-up" key={quizIdx}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E8A020]">Question {quizIdx + 1} / {QUIZ.length}</p>
                  <div className="flex gap-1">
                    {QUIZ.map((_, i) => (
                      <div key={i} className="h-1.5 w-6 rounded-full transition-all duration-300" style={{ background: i <= quizIdx ? "linear-gradient(90deg, #E8A020, #f3b94a)" : "#E9E3D7" }} />
                    ))}
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold">{QUIZ[quizIdx].q}</h3>
                <div className="mt-4 grid gap-2">
                  {QUIZ[quizIdx].options.map((option, index) => (
                    <button key={index} onClick={() => answerQuestion(index)}
                      className="rounded-xl border border-[#E5E0D2] bg-white p-3.5 text-left text-sm font-medium transition-all duration-300 hover:border-[#E8A020] hover:bg-gradient-to-r hover:from-[#FDF7EC] hover:to-white hover:shadow-md hover:-translate-y-0.5">
                      <span className="inline-flex items-center gap-3">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F7F4EF] text-xs font-bold text-[#6B7280]">{String.fromCharCode(65 + index)}</span>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}