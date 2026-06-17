import { useState } from "react";
import { ChevronDown, RotateCw, Sparkles, Cloud, Sun, Trophy, AlertCircle } from "lucide-react";
import WhichSnakeGame from "../components/WhichSnakeGame";
import SpotTheDifference from "../components/SpotTheDifference";

const MYTHS = [
  { myth: "Snakes drink milk", fact: "Fact: Snakes are reptiles and do not naturally drink milk. They are carnivores and cannot properly digest dairy products. During festivals like Nag Panchami, snakes may drink milk only because they are dehydrated, not because they like it." },
  { myth: "Snakes dance to a snake charmer's flute", fact: "Fact: Snakes do not hear airborne sounds the way humans do because they lack external ears. What appears to be 'dancing' is actually the snake following the movement of the flute and the charmer." },
  { myth: "A snake remembers a person's face and takes revenge", fact: "Fact: Snakes do not have the cognitive ability to recognize and remember human faces for revenge. This is a widespread superstition with no scientific basis." },
  { myth: "If one snake is killed, its mate will come looking for revenge", fact: "Fact: Snakes do not form lifelong partnerships or seek revenge. Another snake may be found nearby simply because both occupy the same habitat." },
  { myth: "All snakes are venomous", fact: "Fact: India has over 300 snake species, but only a small fraction are dangerously venomous. Most Indian snakes are non-venomous and harmless to humans." },
  { myth: "Baby snakes are more dangerous than adult snakes", fact: "Fact: Baby venomous snakes can inject venom, but they are not necessarily more dangerous than adults. Adult snakes generally possess larger venom glands and can deliver more venom." },
  { myth: "Snakes chase humans", fact: "Fact: Snakes usually avoid humans. When a snake appears to chase someone, it is often trying to escape toward its shelter, which may happen to be in the same direction." },
  { myth: "Applying a tourniquet or cutting a snakebite wound helps", fact: "Fact: These methods are dangerous and can worsen the injury. The correct response is to keep the victim calm, immobilize the affected limb, and seek immediate medical attention." },
  { myth: "Snake stones can remove venom", fact: "Fact: So-called 'snake stones' have no scientific ability to absorb or neutralize venom. Antivenom administered in a hospital is the only proven treatment for serious venomous snakebites." },
  { myth: "Cobras carry a magical gem (Nagmani)", fact: "Fact: The 'Nagmani' is a myth from folklore. No snake species possesses or produces any magical gem." },
  { myth: "Snakes hypnotize their prey", fact: "Fact: Snakes do not hypnotize prey. Animals may appear frozen due to fear or confusion, not because of any hypnotic power." },
  { myth: "Touching a snake causes instant death", fact: "Fact: Most snakes are harmless. A bite from a non-venomous snake is usually not life-threatening, though it may still require medical care to prevent infection." },
  { myth: "Snakes can sting with their tails", fact: "Fact: Indian snakes bite using their mouths. They do not have venomous stingers in their tails." },
  { myth: "A snake crossing your path is a bad omen", fact: "Fact: This is a cultural belief and has no scientific basis. A snake crossing a path is simply an animal moving through its habitat." },
  { myth: "Killing snakes protects people", fact: "Fact: Snakes help control rodent populations and play an important role in ecosystems. Unnecessary killing of snakes can harm ecological balance." }
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
  const [showAllMyths, setShowAllMyths] = useState(false);
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
            {(showAllMyths ? MYTHS : MYTHS.slice(0, 5)).map((item, index) => (
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
          
          {!showAllMyths && MYTHS.length > 5 && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setShowAllMyths(true)}
                className="rounded-full border border-[#E9E3D7] bg-white px-6 py-2.5 text-sm font-semibold text-[#1A3A2A] transition-all hover:border-[#1A3A2A] hover:bg-black/5"
              >
                View More Myths ({MYTHS.length - 5})
              </button>
            </div>
          )}
        </section>

        {/* Lookalikes / Spot the Difference */}
        <SpotTheDifference />

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

        {/* Dynamic Which Snake Am I Game */}
        <WhichSnakeGame />
      </div>
    </div>
  );
}