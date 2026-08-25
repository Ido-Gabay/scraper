"use client";

import { useEffect, useState, useMemo } from "react";
import pagesData from "@/data/pages_data.json";
import { detectNiche } from "@/lib/niche";
import { getSupabase } from "@/lib/supabaseClient";
import type { BusinessStatus } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lead = (typeof pagesData)[number];
type Status = BusinessStatus;
type StatusMap = Record<string, Status>;

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

const STATUSES: { value: Status; label: string; color: string; dot: string }[] = [
  { value: "new",         label: "חדש (נוצר)",      color: "bg-gray-700 text-gray-200",     dot: "bg-gray-400"   },
  { value: "sent",        label: "נשלח ללקוח",      color: "bg-blue-700 text-blue-100",     dot: "bg-blue-400"   },
  { value: "negotiating", label: "במשא ומתן",        color: "bg-yellow-600 text-yellow-100", dot: "bg-yellow-400" },
  { value: "closed",      label: "נסגר / שולם",      color: "bg-green-700 text-green-100",   dot: "bg-green-400"  },
  { value: "irrelevant",  label: "לא רלוונטי",       color: "bg-red-800 text-red-200",       dot: "bg-red-500"    },
];

const NICHE_LABELS: Record<string, { label: string; color: string }> = {
  clinic:      { label: "קליניקה",      color: "bg-teal-900 text-teal-300 border-teal-700"   },
  photography: { label: "צילום",        color: "bg-rose-900 text-rose-300 border-rose-700"   },
  craft:       { label: "נגרות/ריהוט", color: "bg-amber-900 text-amber-300 border-amber-700" },
  finance:     { label: "פיננסי",       color: "bg-blue-900 text-blue-300 border-blue-700"   },
  fitness:     { label: "כושר",         color: "bg-lime-900 text-lime-300 border-lime-700"   },
};

const NICHE_OPTIONS = ["הכל", "קליניקה", "צילום", "נגרות/ריהוט", "פיננסי", "כושר"];
const LS_KEY = "admin_lead_statuses";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusMeta(s: Status) {
  return STATUSES.find((x) => x.value === s) ?? STATUSES[0];
}

function toWaPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") ? `972${d.slice(1)}` : d;
}

// ─── KPI Bar ──────────────────────────────────────────────────────────────────

function KpiBar({ statuses }: { statuses: StatusMap }) {
  const vals = Object.values(statuses);
  const total    = pagesData.length;
  const sent     = vals.filter((s) => s === "sent").length;
  const nego     = vals.filter((s) => s === "negotiating").length;
  const closed   = vals.filter((s) => s === "closed").length;
  const pipeline = sent + nego + closed;
  const convPct  = pipeline > 0 ? Math.round((closed / pipeline) * 100) : 0;

  const kpis = [
    { label: 'סה"כ אתרים',   value: total,         icon: "📊" },
    { label: "נשלחו ללקוח",  value: sent,           icon: "📤" },
    { label: "במשא ומתן",    value: nego,           icon: "🤝" },
    { label: "נסגרו",        value: closed,         icon: "✅" },
    { label: "יחס המרה",     value: `${convPct}%`,  icon: "🎯" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="bg-slate-800/90 border border-slate-700/60 rounded-2xl px-6 py-5 text-center hover:border-slate-600/80 hover:-translate-y-0.5 transition-transform duration-200 hover:shadow-lg shadow-md transform-gpu"
        >
          <div className="text-3xl mb-2">{k.icon}</div>
          <p className="text-3xl font-black text-white font-heebo">{k.value}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium font-heebo">{k.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Pagination Controls ──────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap font-heebo">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700/60 text-slate-300 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:border-slate-600 transition-colors duration-150"
      >
        ← קודם
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors duration-150 ${
            p === page
              ? "bg-emerald-600 border border-emerald-500 text-white shadow-lg shadow-emerald-950/30"
              : "bg-slate-800/90 border border-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700/60 text-slate-300 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 hover:border-slate-600 transition-colors duration-150"
      >
        הבא →
      </button>
    </div>
  );
}

// ─── Business Card ────────────────────────────────────────────────────────────

function BusinessCard({
  lead,
  status,
  onStatusChange,
  origin,
}: {
  lead: Lead;
  status: Status;
  onStatusChange: (slug: string, s: Status) => void;
  origin: string;
}) {
  const [copied, setCopied] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);
  const niche      = detectNiche(lead.slug);
  const nicheMeta  = NICHE_LABELS[niche] ?? NICHE_LABELS.fitness;
  const statusMeta = getStatusMeta(status);
  const pageUrl    = `${origin}/p/${lead.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const waMessage = `היי ${lead.businessName}, שמי עידו ואני מפתח אתרים.

אהבתי מאוד את העבודות שלכם, ולכן כחלק מפרויקט שדרוג נוכחות לעסקים בתחום ה-${nicheMeta.label}, העליתי עבורכם תצוגה מקדימה זמנית לאתר מודרני מותאם אישית:
${pageUrl}

הדף באוויר לזמן מוגבל לצורך התרשמות. אם תרצו להעלות אותו באופן קבוע לרשת תחת הדומיין שלכם — סמסו לי חזרה ונרים אותו יחד בלחיצת כפתור!`;

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(waMessage);
    setMessageCopied(true);
    setTimeout(() => setMessageCopied(false), 1800);
  };

  const waHref = `https://wa.me/${toWaPhone(lead.contact.phone)}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-600/80 hover:-translate-y-0.5 transition-transform duration-200 hover:shadow-xl shadow-md font-heebo transform-gpu contain-content">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-snug truncate font-heebo">
            {lead.businessName}
          </h3>
          <p className="text-slate-400 text-sm mt-1 font-heebo">{lead.contact.phone}</p>
          {lead.contact.address && (
            <p className="text-slate-500 text-xs mt-1 truncate font-heebo">{lead.contact.address}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${nicheMeta.color} font-heebo`}>
          {nicheMeta.label}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-amber-400 text-sm font-semibold font-heebo">⭐ {lead.rating}</span>
        <span className="text-slate-500 text-xs font-heebo">({lead.reviewCount} ביקורות)</span>
      </div>

      {/* Status selector */}
      <div className="flex items-center gap-3 bg-slate-700/40 border border-slate-700/40 rounded-lg px-3 py-2.5">
        <span className={`w-3 h-3 rounded-full shrink-0 ${statusMeta.dot}`} />
        <select
          value={status}
          onChange={(e) => onStatusChange(lead.slug, e.target.value as Status)}
          className="flex-1 bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer font-heebo font-medium"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-slate-900 text-slate-200">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <a
          href={`/p/${lead.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-slate-700/50 border border-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-colors duration-150 font-heebo"
        >
          <span>👁</span> <span className="hidden sm:inline">צפה</span>
        </a>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 bg-slate-700/50 border border-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-colors duration-150 font-heebo"
          title="העתק קישור לדף"
        >
          <span>{copied ? "✓" : "🔗"}</span>
          <span className="hidden sm:inline">{copied ? "הועתק" : "קישור"}</span>
        </button>
        <button
          onClick={handleCopyMessage}
          className="flex items-center justify-center gap-1.5 bg-slate-700/50 border border-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-lg transition-colors duration-150 font-heebo"
          title="העתק הודעה ל-WhatsApp"
        >
          <span>{messageCopied ? "✓" : "📋"}</span>
          <span className="hidden sm:inline">{messageCopied ? "הועתק" : "הודעה"}</span>
        </button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-emerald-600/25 border border-emerald-600/40 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold py-2.5 rounded-lg transition-colors duration-150 font-heebo"
        >
          <span>💬</span> <span className="hidden sm:inline">שלח</span>
        </a>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [search, setSearch]     = useState("");
  const [nicheFilter, setNicheFilter] = useState("הכל");
  const [statusFilter, setStatusFilter] = useState<"הכל" | Status>("הכל");
  const [origin, setOrigin]     = useState("");
  const [page, setPage]         = useState(1);
  const [supabaseReady, setSupabaseReady] = useState(false);

  // ── Bootstrap: origin + load statuses (Supabase first, localStorage fallback) ──
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    setOrigin(baseUrl);

    async function loadStatuses() {
      // If Supabase env vars are present, try fetching from DB
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("businesses")
            .select("slug, status") as { data: { slug: string; status: string }[] | null; error: unknown };
          if (!error && data && data.length > 0) {
            const map: StatusMap = {};
            data.forEach((row) => { map[row.slug] = row.status as Status; });
            setStatuses(map);
            setSupabaseReady(true);
            return;
          }
        } catch {}
      }
      // Fallback: localStorage
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setStatuses(JSON.parse(raw));
      } catch {}
    }

    loadStatuses();
  }, []);

  // ── Status change: persist to Supabase (if available) AND localStorage ──
  const handleStatusChange = async (slug: string, s: Status) => {
    const next = { ...statuses, [slug]: s };
    setStatuses(next);

    if (supabaseReady) {
      const sb = getSupabase();
      if (sb) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sb as any)
          .from("businesses")
          .update({ status: s })
          .eq("slug", slug);
      }
    }

    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  };

  const getStatus = (slug: string): Status => statuses[slug] ?? "new";

  // ── Filter + paginate ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return pagesData.filter((lead) => {
      const niche     = detectNiche(lead.slug);
      const nicheName = NICHE_LABELS[niche]?.label ?? "";
      if (search && !lead.businessName.toLowerCase().includes(search.toLowerCase())) return false;
      if (nicheFilter !== "הכל" && nicheName !== nicheFilter) return false;
      if (statusFilter !== "הכל" && getStatus(lead.slug) !== statusFilter) return false;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, nicheFilter, statusFilter, statuses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [search, nicheFilter, statusFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-heebo" dir="rtl">
      {/* Sticky header */}
      <header className="border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight font-heebo">לוח בקרה</h1>
            <p className="text-xs text-slate-400 mt-0.5 font-heebo">ניהול אתרי לידים</p>
          </div>
          <div className="flex items-center gap-3">
            {supabaseReady && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-heebo font-medium">
                🟢 מחובר ל-Supabase
              </span>
            )}
            <span className="text-xs text-slate-300 bg-slate-800/60 px-4 py-2 rounded-full font-medium border border-slate-700/40 font-heebo">
              {pagesData.length} עסקים
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* KPI strip */}
        <KpiBar statuses={statuses} />

        {/* Filters toolbar */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 mb-8 flex flex-col gap-3">
          <input
            type="text"
            placeholder="חיפוש לפי שם עסק..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700/60 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 font-heebo"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="flex-1 bg-slate-900/60 border border-slate-700/60 text-slate-200 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer font-heebo"
            >
              {NICHE_OPTIONS.map((n) => <option key={n}>{n}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "הכל" | Status)}
              className="flex-1 bg-slate-900/60 border border-slate-700/60 text-slate-200 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer font-heebo"
            >
              <option value="הכל">כל הסטטוסים</option>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results count + page info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-400 font-medium font-heebo">
            מציג {paginated.length} מתוך {filtered.length} עסקים
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-slate-500 font-heebo">
              עמוד {page} מתוך {totalPages}
            </p>
          )}
        </div>

        {/* Cards grid — max 12 cards, zero lag */}
        {paginated.length === 0 ? (
          <div className="text-center py-24 text-slate-500 font-heebo">
            לא נמצאו עסקים התואמים את הסינון
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {paginated.map((lead) => (
              <BusinessCard
                key={lead.slug}
                lead={lead}
                status={getStatus(lead.slug)}
                onStatusChange={handleStatusChange}
                origin={origin}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </main>
    </div>
  );
}
