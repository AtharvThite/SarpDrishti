import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Search, Locate } from "lucide-react";
import { Link } from "react-router-dom";

import RescuerCard from "../components/RescuerCard";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function RescuersPage() {
  const [rescuers, setRescuers] = useState([]);
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRescuers = async (districtName = "") => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/rescuers`,
        {
          params: districtName
            ? { district: districtName }
            : {},
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
  }, []);

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
            Local Heroes
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            Find a Snake Rescuer Near You
          </h1>

          <p className="mt-3 max-w-2xl text-[#D1D5DB]">
            Verified rescuers across India ready to
            safely relocate snakes from your area.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
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
              placeholder="Enter your district or city..."
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
            Use My Location
          </button>

          <button
            onClick={() =>
              fetchRescuers(district)
            }
            className="sd-btn-primary"
            data-testid="search-rescuers-btn"
          >
            <Search size={14} />
            Search
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p
            className="text-sm text-[#6B7280]"
            data-testid="rescuer-count"
          >
            {rescuers.length} rescuers found
          </p>

          <Link
            to="/rescuer/register"
            className="text-sm font-semibold text-[#1A3A2A] hover:underline"
          >
            Are you a rescuer? Register →
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-[#6B7280]">
            Loading...
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