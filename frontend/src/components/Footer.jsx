import { Link } from "react-router-dom";
import { BookAIcon , BirdIcon, CameraIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-16 text-[#D1D5DB] gradient-hero relative overflow-hidden"
      data-testid="footer"
    >
      {/* Decorative orbs */}
      <div className="orb orb-amber w-80 h-80 -top-40 -left-20" />
      <div className="orb orb-green w-60 h-60 -bottom-20 right-10" />

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 relative z-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold gradient-text">
                SarpDrishti
              </span>
            </div>

            <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed">
              See it. Identify it. Stay Safe.
              <br />
              <span className="text-xs opacity-70">AI-powered snake identification for India.</span>
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base font-semibold text-[#E8A020]">
              Navigate
            </h4>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/identify" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Identify
                </Link>
              </li>

              <li>
                <Link to="/snakes" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Browse Snakes
                </Link>
              </li>

              <li>
                <Link to="/rescuers" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Find Rescuers
                </Link>
              </li>

              <li>
                <Link to="/emergency" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Emergency Guide
                </Link>
              </li>

              <li>
                <Link to="/awareness" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Awareness
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base font-semibold text-[#E8A020]">
              Connect
            </h4>

            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  About
                </a>
              </li>

              <li>
                <a href="#" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Partners
                </a>
              </li>

              <li>
                <a href="#" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Contact
                </a>
              </li>

              <li>
                <Link to="/rescuer/register" className="transition-all duration-300 hover:text-white hover:translate-x-1 inline-block">
                  Register as Rescuer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base font-semibold text-[#E8A020]">
              Follow
            </h4>

            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-full glass p-2.5 hover:bg-white/15 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                data-testid="social-fb"
              >
                <BookAIcon size={16} />
              </a>

              <a
                href="#"
                className="rounded-full glass p-2.5 hover:bg-white/15 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                data-testid="social-tw"
              >
                <BirdIcon size={16} />
              </a>

              <a
                href="#"
                className="rounded-full glass p-2.5 hover:bg-white/15 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                data-testid="social-ig"
              >
                <CameraIcon size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="section-divider mt-10 mb-6" />

        <div className="text-xs text-[#94A3B8]">
          SarpDrishti is an assistive tool. Always consult medical
          professionals in an emergency. © {new Date().getFullYear()}{" "}
          SarpDrishti.
        </div>
      </div>
    </footer>
  );
}