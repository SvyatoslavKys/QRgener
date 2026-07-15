import { Link } from "react-router-dom";
import { GENERATE_DATE, SCAN_DATA } from "./constants";
import { Icon } from "./Icon";
import { readHistory } from "./historyStorage";

const actionCards = [
  {
    to: "/scan",
    icon: "scan",
    title: "Scan a QR code",
    text: "Point your camera at any QR code and get the result instantly.",
    accent: "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-100",
  },
  {
    to: "/generate",
    icon: "qr",
    title: "Create a QR code",
    text: "Turn a link, message, or any text into a shareable QR code.",
    accent: "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100",
  },
];

export const Home = () => {
  const generatedCount = readHistory(GENERATE_DATE).length;
  const scannedCount = readHistory(SCAN_DATA).length;
  const logoUrl = `${import.meta.env.BASE_URL}qrlogo.svg`;

  return (
    <div className="page-container">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-900/15 sm:px-10 sm:py-14 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-14 lg:py-16">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">
            <Icon name="sparkles" className="h-4 w-4" />
            Simple QR toolkit
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Scan. Create.
            <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Share instantly.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Everything you need to work with QR codes in one clean, private, and easy-to-use space.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/scan" className="primary-button bg-white text-slate-950 shadow-white/10 hover:bg-indigo-50">
              <Icon name="scan" />
              Start scanning
            </Link>
            <Link to="/generate" className="secondary-button border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 hover:text-white">
              Create a code
              <Icon name="arrow" />
            </Link>
          </div>
        </div>

        <div className="floating-preview relative z-10 mx-auto mt-12 hidden w-full max-w-sm lg:mt-0 lg:block">
          <div className="rotate-3 rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="rounded-3xl bg-white p-7 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Ready to share</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.14)]" />
              </div>
              <div className="mx-auto my-8 flex aspect-square w-48 items-center justify-center rounded-3xl bg-slate-950 p-7">
                <img src={logoUrl} alt="Decorative QR code" className="h-full w-full brightness-0 invert" />
              </div>
              <div className="h-2.5 w-2/3 rounded-full bg-slate-100" />
              <div className="mt-2 h-2.5 w-1/2 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
{/* 
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {actionCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="surface-card group flex items-start gap-5 p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-[0_24px_60px_-28px_rgba(79,70,229,0.35)] sm:p-7"
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${card.accent}`}>
              <Icon name={card.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center justify-between gap-3">
                <span className="text-lg font-extrabold tracking-tight text-slate-950">{card.title}</span>
                <Icon name="arrow" className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-500">{card.text}</span>
            </span>
          </Link>
        ))}
      </section> */}

      <section className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4 text-emerald-900">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <Icon name="shield" />
          </span>
          <div>
            <p className="text-sm font-bold">Private by design</p>
            <p className="mt-0.5 text-xs leading-5 text-emerald-700">Your history is stored only in this browser.</p>
          </div>
        </div>
        {(generatedCount > 0 || scannedCount > 0) && (
          <Link to="/history" className="text-center text-sm font-semibold text-indigo-700 hover:text-indigo-900">
            {generatedCount} created · {scannedCount} scanned →
          </Link>
        )}
      </section>
    </div>
  );
};
