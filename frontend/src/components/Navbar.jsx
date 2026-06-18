import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Siren } from "lucide-react";
import logoImage from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const links = [
  { to: "/", i18nKey: "home", defaultLabel: "Home" },
  { to: "/identify", i18nKey: "identify", defaultLabel: "Identify" },
  { to: "/snakes", i18nKey: "snakes", defaultLabel: "Snakes" },
  { to: "/rescuers", i18nKey: "rescuers", defaultLabel: "Rescuers" },
  { to: "/awareness", i18nKey: "awareness", defaultLabel: "Awareness" },
];


export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
        ? "glass-light shadow-lg"
        : ""
        }`}
      style={{
        background: scrolled
          ? undefined
          : "rgba(247,244,239,0.92)",
        borderBottom: scrolled
          ? undefined
          : "1px solid rgba(0,0,0,0.06)",
        backdropFilter: scrolled ? undefined : "blur(12px)",
      }}
      data-testid="navbar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-0 group"
          data-testid="logo-link"
        >
          <img
            src={logoImage}
            alt="SarpDrishti Logo"
            className="h-16 w-auto mix-blend-multiply transition-all duration-300 group-hover:scale-105 -ml-2"
          />
          <span
            className="font-display text-2xl font-bold bg-gradient-to-r from-[#1A3A2A] to-[#2C5742] bg-clip-text text-transparent transition-all duration-300 ml-3"
          >
            {t('nav.brand')}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          data-testid="desktop-nav"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.defaultLabel.toLowerCase()}`}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-[#1A3A2A] to-[#2C5742] text-white shadow-md"
                  : "text-[#1c1c1c] hover:bg-black/5 hover:text-[#1A3A2A]"
                }`
              }
            >
              {t(`nav.${l.i18nKey}`)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          <Link
            to="/emergency"
            data-testid="emergency-btn-navbar"
            className="sd-btn-danger pulse-red hidden sm:inline-flex"
            style={{ padding: "0.55rem 1.1rem", fontSize: 14 }}
          >
            <Siren size={16} />
            {t('nav.emergency')}
          </Link>

          <button
            className="rounded-lg p-2 md:hidden transition-all duration-300 hover:bg-black/5"
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="border-t border-black/5 bg-[#F7F4EF] md:hidden slide-down"
          data-testid="mobile-nav"
        >
          <div className="flex flex-col px-4 py-3 stagger-children">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.defaultLabel.toLowerCase()}`}
                className={`rounded-lg px-3 py-3 text-base fade-up transition-all duration-300 ${location.pathname === l.to
                  ? "bg-gradient-to-r from-[#1A3A2A] to-[#2C5742] text-white"
                  : "text-[#1c1c1c] hover:bg-black/5"
                  }`}
              >
                {t(`nav.${l.i18nKey}`)}
              </Link>
            ))}

            <Link
              to="/emergency"
              onClick={() => setOpen(false)}
              data-testid="mobile-emergency-btn"
              className="sd-btn-danger mt-2 fade-up"
            >
              <Siren size={16} />
              {t('nav.emergency')}
            </Link>
            <div className="mt-4 fade-up">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}