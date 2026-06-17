import { useState, useEffect, useMemo } from "react";
import { Sparkles, Trophy, RotateCw, AlertCircle } from "lucide-react";
import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const QUESTION_TYPES = ["behavior", "habitat", "features"];
const TOTAL_QUESTIONS = 5;

// Helper to shuffle an array
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function WhichSnakeGame() {
  const [snakes, setSnakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Fetch snakes
  useEffect(() => {
    axios.get(`${API}/snakes`)
      .then((response) => {
        setSnakes(response.data.snakes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Generate questions when snakes are loaded
  useEffect(() => {
    if (snakes.length > 4) {
      generateQuestions();
    }
  }, [snakes]);

  const generateQuestions = () => {
    const generated = [];
    
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      // Pick a random correct snake
      const correctSnake = snakes[Math.floor(Math.random() * snakes.length)];
      
      // Pick random wrong snakes
      const otherSnakes = snakes.filter((s) => s.slug !== correctSnake.slug);
      const wrongSnakes = shuffleArray(otherSnakes).slice(0, 3);
      
      const options = shuffleArray([
        { text: correctSnake.common_name, isCorrect: true },
        ...wrongSnakes.map(s => ({ text: s.common_name, isCorrect: false }))
      ]);

      const imagePool = correctSnake.images?.length > 0 ? correctSnake.images : [correctSnake.thumbnail];
      const imageUrl = imagePool[Math.floor(Math.random() * imagePool.length)];

      generated.push({ imageUrl, options });
    }

    setQuestions(generated);
    setCurrentIdx(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleAnswer = (isCorrect) => {
    const nextAnswers = [...answers, isCorrect];
    setAnswers(nextAnswers);
    if (nextAnswers.length === TOTAL_QUESTIONS) {
      setShowResult(true);
    } else {
      setCurrentIdx(p => p + 1);
    }
  };

  if (loading) return <div className="text-center py-10 text-[#6B7280]">Loading game data...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading game: {error}</div>;
  if (snakes.length < 4) return null; // Not enough data for 4 options

  const score = answers.filter(a => a).length;
  const currentQ = questions[currentIdx];

  return (
    <section className="mt-14 fade-up">
      <h2 className="flex items-center gap-2 font-display text-3xl font-bold text-[#1A3A2A]">
        <Sparkles size={22} className="text-[#27AE60]" /> Which Snake Am I?
      </h2>
      <p className="mt-2 text-[#6B7280]">Test your knowledge based on real snake behaviors, habitats, and physical traits!</p>
      
      <div className="sd-card mt-5 p-6" style={{ background: "linear-gradient(135deg, rgba(39,174,96,0.03), rgba(255,255,255,1))" }}>
        {showResult ? (
          <div className="text-center fade-up">
            <div className="mx-auto w-fit rounded-2xl p-4 mb-4" style={{ background: "linear-gradient(135deg, rgba(39,174,96,0.15), rgba(39,174,96,0.05))" }}>
              <Trophy size={40} className="text-[#27AE60]" />
            </div>
            <p className="font-mono text-sm uppercase tracking-wider text-[#27AE60]">Your Score</p>
            <p className="my-3 font-display text-6xl font-bold text-[#1A3A2A]">{score} / {TOTAL_QUESTIONS}</p>
            <p className="text-sm text-[#6B7280] mb-4">
              {score === TOTAL_QUESTIONS ? "Incredible! You're a true Herpetologist." : 
               score >= 3 ? "Great job! You know your snakes well." : 
               "Keep exploring the snake library to learn more!"}
            </p>
            <button onClick={generateQuestions} className="sd-btn-primary">
              <RotateCw size={14} /> Play Again
            </button>
          </div>
        ) : (
          currentQ && (
            <div className="fade-up" key={currentIdx}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#27AE60]">
                  Question {currentIdx + 1} / {TOTAL_QUESTIONS}
                </p>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div 
                      key={i} 
                      className="h-1.5 w-6 rounded-full transition-all duration-300" 
                      style={{ background: i <= currentIdx ? "linear-gradient(90deg, #27AE60, #2ecc71)" : "#E9E3D7" }} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-6 overflow-hidden rounded-xl bg-[#F9FAFB] border border-black/5 shadow-sm">
                <div className="bg-[#1A3A2A] px-5 py-3">
                  <p className="font-semibold text-white text-lg text-center">Which snake is this?</p>
                </div>
                <div className="relative aspect-[16/9] w-full bg-black/5">
                  <img 
                    src={currentQ.imageUrl} 
                    alt="Mystery Snake" 
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x500/1A3A2A/ffffff?text=Image+Not+Found";
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {currentQ.options.map((option, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleAnswer(option.isCorrect)}
                    className="rounded-xl border border-[#E5E0D2] bg-white p-4 text-left text-sm font-medium transition-all duration-300 hover:border-[#27AE60] hover:bg-gradient-to-r hover:from-[#F0FDF4] hover:to-white hover:shadow-md hover:-translate-y-0.5"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F7F4EF] text-xs font-bold text-[#6B7280]">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
