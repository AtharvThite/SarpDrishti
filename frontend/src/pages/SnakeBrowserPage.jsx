import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import SnakeCard from "../components/SnakeCard";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const REGIONS = [
  { value: "all", label: "All India" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "kerala", label: "Kerala" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "karnataka", label: "Karnataka" },
];

export default function SnakeBrowserPage() {
  const { t } = useTranslation();
  const [snakes, setSnakes] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [region, setRegion] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API}/snakes`)
      .then((response) => {
        setSnakes(response.data.snakes || []);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return snakes.filter((snake) => {
      if (
        filter === "venomous" &&
        !snake.is_venomous
      ) {
        return false;
      }

      if (
        filter === "non-venomous" &&
        snake.is_venomous
      ) {
        return false;
      }

      if (
        region !== "all" &&
        !(snake.distribution || []).map(d => d.toLowerCase().replace(" ", "-")).includes(region)
      ) {
        return false;
      }

      if (
        q &&
        !`${snake.common_name} ${snake.scientific_name}`
          .toLowerCase()
          .includes(q.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [snakes, q, filter, region]);

  return (
    <div data-testid="snake-browser-page">
      <header
        className="sd-scale-pattern py-14"
        style={{
          background:
            "linear-gradient(135deg, #1A3A2A 0%, #0F2318 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020]">
            {t('snakeBrowser.label')}
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            {t('snakeBrowser.title')}
          </h1>

          <p className="mt-3 max-w-2xl text-[#D1D5DB]">
            {t('snakeBrowser.subtitle')}
          </p>
        </div>
      </header>

      <div
        className="sticky top-16 z-30 border-b border-black/5 backdrop-blur-md"
        style={{
          background: "rgba(247,244,239,0.95)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />

              <input
                value={q}
                onChange={(e) =>
                  setQ(e.target.value)
                }
                placeholder={t('snakeBrowser.searchPlaceholder')}
                className="w-full rounded-lg border border-[#E5E0D2] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#1A3A2A] focus:outline-none"
                data-testid="search-input"
              />
            </div>

            <div
              className="flex rounded-lg border border-[#E5E0D2] bg-white p-1"
              data-testid="venom-filter"
            >
              {[
                { v: "all", label: t('snakeBrowser.all') },
                {
                  v: "venomous",
                  label: t('snakeBrowser.venomous'),
                },
                {
                  v: "non-venomous",
                  label: t('snakeBrowser.nonVenomous'),
                },
              ].map((option) => (
                <button
                  key={option.v}
                  onClick={() =>
                    setFilter(option.v)
                  }
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    filter === option.v
                      ? "bg-[#1A3A2A] text-white"
                      : "text-[#1c1c1c] hover:bg-black/5"
                  }`}
                  data-testid={`filter-${option.v}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <select
              value={region}
              onChange={(e) =>
                setRegion(e.target.value)
              }
              className="rounded-lg border border-[#E5E0D2] bg-white px-3 py-2 text-sm focus:border-[#1A3A2A] focus:outline-none"
              data-testid="region-filter"
            >
              {REGIONS.map((regionItem) => (
                <option
                  key={regionItem.value}
                  value={regionItem.value}
                >
                  {regionItem.value === 'all' ? t('snakeBrowser.allIndia') : regionItem.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {loading ? (
          <p className="text-center text-[#6B7280]">
            {t('snakeBrowser.loading')}
          </p>
        ) : filtered.length === 0 ? (
          <p
            className="text-center text-[#6B7280]"
            data-testid="no-results"
          >
            {t('snakeBrowser.noResults')}
          </p>
        ) : (
          <>
            <p
              className="mb-4 text-sm text-[#6B7280]"
              data-testid="result-count"
            >
              {filtered.length} {t('snakeBrowser.species')}
            </p>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((snake) => (
                <SnakeCard
                  key={snake.slug}
                  snake={snake}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}