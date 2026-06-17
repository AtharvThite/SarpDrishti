import { useState } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  User,
  FileText,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const ALL_DISTRICTS = [
  "Mumbai",
  "Pune",
  "Thane",
  "Nashik",
  "Nagpur",
  "Aurangabad",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Ahmedabad",
  "Jaipur",
];

const inputCls =
  "w-full rounded-lg border border-[#E5E0D2] bg-white px-3 py-2.5 text-sm focus:border-[#1A3A2A] focus:outline-none";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function RescuerRegisterPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    full_name: "",
    phone: "",
    whatsapp_same: true,
    whatsapp: "",
    email: "",
    districts: [],
    experience_years: "",
    organization: "",
    govt_id_type: "Aadhaar",
    govt_id_number: "",
    service_radius_km: 25,
    available_247: false,
    availability_hours: "",
    bio: "",
    lat: "",
    lng: "",
  });

  const updateField = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleDistrict = (district) => {
    const updated = data.districts.includes(district)
      ? data.districts.filter((d) => d !== district)
      : [...data.districts, district];

    updateField("districts", updated);
  };

  const canNext = () => {
    if (step === 1) {
      return (
        data.full_name.trim() &&
        data.phone.trim() &&
        data.districts.length > 0
      );
    }

    if (step === 2) {
      return data.govt_id_number.trim();
    }

    return true;
  };

  const submit = async () => {
    try {
      setSubmitting(true);

      const formattedPhone = data.phone.startsWith("+91") ? data.phone : `+91${data.phone}`;
      const formattedWhatsapp = data.whatsapp_same
        ? formattedPhone
        : (data.whatsapp.startsWith("+91") ? data.whatsapp : `+91${data.whatsapp}`);

      const payload = {
        name: data.full_name,
        phone: formattedPhone,
        whatsapp: formattedWhatsapp,
        email: data.email,
        districts_covered: data.districts,
        experience_years: Number(data.experience_years || 0),
        organization: data.organization,
        govt_id_type: data.govt_id_type,
        govt_id_number: data.govt_id_number,
        service_radius_km: data.service_radius_km,
        available_247: data.available_247,
        availability_hours: data.availability_hours,
        bio: data.bio,
        lat: data.lat,
        lng: data.lng,
      };

      await axios.post(
        `${API}/rescuers/register`,
        payload
      );

      setDone(true);
    } catch (error) {
      console.error(error);
      toast.error(
        "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8"
        data-testid="register-success"
      >
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#27AE60]/15">
          <Check
            className="text-[#27AE60]"
            size={40}
          />
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold text-[#1A3A2A]">
          Registration submitted!
        </h1>

        <p className="mt-3 text-[#6B7280]">
          Our team will verify your credentials
          within 48 hours and contact you via
          WhatsApp and email.
        </p>

        <p className="mt-1 text-sm text-[#6B7280]">
          Reference: SD-
          {Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10 lg:px-8"
      data-testid="rescuer-register-page"
    >
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#E8A020]">
          Rescuer Onboarding
        </p>

        <h1 className="font-display text-4xl font-bold text-[#1A3A2A]">
          Register as a Rescuer
        </h1>
      </header>

      <div className="mb-6 flex items-center gap-3">
        {[1, 2, 3].map((currentStep, index) => (
          <div
            key={currentStep}
            className="flex flex-1 items-center gap-3"
          >
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-sm font-bold ${
                step >= currentStep
                  ? "bg-[#1A3A2A] text-white"
                  : "bg-[#E9E3D7] text-[#6B7280]"
              }`}
            >
              {step > currentStep ? (
                <Check size={16} />
              ) : (
                currentStep
              )}
            </div>

            {index < 2 && (
              <div
                className="h-1 flex-1 rounded-full"
                style={{
                  background:
                    step > currentStep
                      ? "#1A3A2A"
                      : "#E9E3D7",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="sd-card p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-[#1A3A2A]">
              <User size={18} />
              Personal Info
            </h2>

            <Field label="Full Name *">
              <input
                value={data.full_name}
                onChange={(e) =>
                  updateField(
                    "full_name",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Phone Number *">
              <input
                value={data.phone}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Email">
              <input
                value={data.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Districts Covered *
              </label>

              <div className="flex flex-wrap gap-2">
                {ALL_DISTRICTS.map(
                  (district) => (
                    <button
                      key={district}
                      type="button"
                      onClick={() =>
                        toggleDistrict(
                          district
                        )
                      }
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        data.districts.includes(
                          district
                        )
                          ? "bg-[#1A3A2A] text-white"
                          : "bg-[#F7F4EF]"
                      }`}
                    >
                      {district}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-[#1A3A2A]">
              <FileText size={18} />
              Credentials
            </h2>

            <Field label="Government ID Type">
              <select
                value={data.govt_id_type}
                onChange={(e) =>
                  updateField(
                    "govt_id_type",
                    e.target.value
                  )
                }
                className={inputCls}
              >
                <option>Aadhaar</option>
                <option>PAN</option>
                <option>Voter ID</option>
                <option>Driver's License</option>
              </select>
            </Field>

            <Field label="Government ID Number *">
              <input
                value={data.govt_id_number}
                onChange={(e) =>
                  updateField(
                    "govt_id_number",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <label className="block cursor-pointer rounded-lg border-2 border-dashed border-[#E5E0D2] bg-[#F7F4EF] p-5 text-center">
              <Upload
                className="mx-auto text-[#6B7280]"
                size={20}
              />
              <p className="mt-2 text-sm text-[#6B7280]">
                Upload certificates
              </p>
              <input
                type="file"
                className="hidden"
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-[#1A3A2A]">
              <MapPin size={18} />
              Coverage & Availability
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                Base Location *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          updateField("lat", pos.coords.latitude);
                          updateField("lng", pos.coords.longitude);
                          toast.success("Location captured successfully!");
                        },
                        (err) => {
                          toast.error("Could not fetch location. Please enter manually.");
                        }
                      );
                    } else {
                      toast.error("Geolocation not supported by your browser");
                    }
                  }}
                  className="rounded-lg border border-[#E5E0D2] bg-white px-4 py-2 text-sm font-semibold text-[#1A3A2A] hover:bg-[#F7F4EF]"
                >
                  Get Current Location
                </button>
                {data.lat && data.lng && (
                  <span className="text-sm text-[#27AE60] font-medium flex items-center gap-1">
                    <Check size={14} /> Set ({Number(data.lat).toFixed(4)}, {Number(data.lng).toFixed(4)})
                  </span>
                )}
              </div>
            </div>

            <Field label="Service Radius">
              <input
                type="range"
                min={5}
                max={100}
                value={data.service_radius_km}
                onChange={(e) =>
                  updateField(
                    "service_radius_km",
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full"
              />
            </Field>

            <Field label="Availability Hours">
              <input
                value={
                  data.availability_hours
                }
                onChange={(e) =>
                  updateField(
                    "availability_hours",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>

            <Field label="Bio">
              <textarea
                rows={4}
                value={data.bio}
                onChange={(e) =>
                  updateField(
                    "bio",
                    e.target.value
                  )
                }
                className={inputCls}
              />
            </Field>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() =>
              setStep((prev) =>
                Math.max(1, prev - 1)
              )
            }
            className="inline-flex items-center gap-1 rounded-lg border-2 border-[#1A3A2A] px-4 py-2 text-sm font-semibold text-[#1A3A2A] disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() =>
                setStep((prev) => prev + 1)
              }
              className="sd-btn-primary disabled:opacity-50"
            >
              Next
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !data.lat || !data.lng}
              className="sd-btn-primary disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}