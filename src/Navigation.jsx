import { NavLink } from "react-router-dom";
import { Icon } from "./Icon";

const navItems = [
  { to: "/", label: "Home", icon: "home", end: true },
  { to: "/scan", label: "Scan", icon: "scan" },
  { to: "/generate", label: "Create", icon: "qr" },
  { to: "/history", label: "History", icon: "history" },
];

const desktopLinkClass = ({ isActive }) =>
  `relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
  }`;

export const Navigation = () => {
  const logoUrl = `${import.meta.env.BASE_URL}qrlogo.svg`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="group flex items-center gap-3" aria-label="QR Studio home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 shadow-lg shadow-slate-900/15 transition group-hover:-rotate-3 group-hover:scale-105">
              <img src={logoUrl} alt="" className="h-6 w-6 brightness-0 invert" />
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-tight text-slate-950">QR Studio</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Scan · Create · Share
              </span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={desktopLinkClass}>
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <nav
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-white/80 bg-white/90 p-1.5 shadow-[0_18px_45px_-14px_rgba(15,23,42,0.4)] backdrop-blur-xl md:hidden"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={mobileLinkClass}>
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
};
