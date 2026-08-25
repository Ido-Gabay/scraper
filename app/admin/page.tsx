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

const STATUSES: { value: Status; label: string; dot: string; ring: string }[] = [
  { value: "new",         label: "חדש",            dot: "bg-slate-400",   ring: "ring-slate-400/30"   },
  { value: "sent",        label: "נשלח ללקוח",     dot: "bg-blue-400",    ring: "ring-blue-400/30"    },
  { value: "negotiating", label: "במשא ומתן",      dot: "bg-amber-400",   ring: "ring-amber-400/30"   },
  { value: "closed",      label: "נסגר / שולם",    dot: "bg-emerald-400", ring: "ring-emerald-400/30" },
  { value: "irrelevant",  label: "לא רלוונטי",     dot: "bg-red-400",     ring: "ring-red-400/30"     },
];

const STATUS_BADGE: Record<Status, string> = {
  new:         "text-slate-300 bg-slate-800 border-slate-700",
  sent:        "text-blue-300 bg-blue-950 border-blue-800",
  negotiating: "text-amber-300 bg-amber-950 border-amber-800",
  closed:      "text-emerald-300 bg-emerald-950 border-emerald-800",
  irrelevant:  "text-red-300 bg-red-950 border-red-900",
};

const NICHE_META: Record<string, { label: string; color: string; bg: string }> = {
  clinic:      { label: "קליניקה",     color: "text-teal-300",   bg: "bg-teal-500/10 border-teal-500/25"   },
  photography: { label: "צילום",       color: "text-rose-300",   bg: "bg-rose-500/10 border-rose-500/25"   },
  craft:       { label: "נגרות/ריהוט", color: "text-amber-300",  bg: "bg-amber-500/10 border-amber-500/25" },
  finance:     { label: "פיננסי",      color: "text-blue-300",   bg: "bg-blue-500/10 border-blue-500/25"   },
  fitness:     { label: "כושר",        color: "text-lime-300",   bg: "bg-lime-500/10 border-lime-500/25"   },
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

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, accent,
}: {
  label: string; value: string | number; sub?: string; accent: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-900 p-5 flex flex-col gap-1 ${accent}`}>
      <p className="text-xs font-medium text-slate-400 font-heebo">{label}</p>
      <p className="text-3xl font-black text-white tracking-tight font-heebo">{value}</p>
      {sub && <p className="text-xs text-slate-500 font-heebo">{sub}</p>}
    </div>
  );
}

// ─── Pipeline Progress Bar ────────────────────────────────────────────────────

function PipelineBar({ statuses }: { statuses: StatusMap }) {
  const vals = Object.values(statuses);
  const total = pagesData.length;
  const counts = {
    new:         vals.filter((s) => s === "new").length + (total - vals.length),
    sent:        vals.filter((s) => s === "sent").length,
    negotiating: vals.filter((s) => s === "negotiating").length,
    closed:      vals.filter((s) => s === "closed").length,
    irrelevant:  vals.filter((s) => s === "irrelevant").length,
  };

  const segments = [
    { key: "new",         pct: (counts.new / total) * 100,         color: "bg-slate-600"   },
    { key: "sent",        pct: (counts.sent / total) * 100,        color: "bg-blue-500"    },
    { key: "negotiating", pct: (counts.negotiating / total) * 100, color: "bg-amber-500"   },
    { key: "closed",      pct: (counts.closed / total) * 100,      color: "bg-emerald-500" },
    { key: "irrelevant",  pct: (counts.irrelevant / total) * 100,  color: "bg-red-500"     },
  ];

  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-px">
      {segments.map((s) =>
        s.pct > 0 ? (
          <div
            key={s.key}
            className={`${s.color} transition-all duration-500`}
            style={{ width: `${s.pct}%` }}
          />
        ) : null
      )}
    </div>
  );
}

// ─── KPI Strip ────────────────────────────────────────────────────────────────

function KpiStrip({ statuses }: { statuses: StatusMap }) {
  const vals = Object.values(statuses);
  const total    = pagesData.length;
  const sent     = vals.filter((s) => s === "sent").length;
  const nego     = vals.filter((s) => s === "negotiating").length;
  const closed   = vals.filter((s) => s === "closed").length;
  const pipeline = sent + nego + closed;
  const convPct  = pipeline > 0 ? Math.round((closed / pipeline) * 100) : 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard label='סה"כ עסקים'  value={total}        accent="border-slate-800"                                       />
        <KpiCard label="נשלחו ללקוח" value={sent}         accent="border-blue-900/60"    sub={sent > 0 ? `מתוך ${total}` : undefined} />
        <KpiCard label="במשא ומתן"   value={nego}         accent="border-amber-900/60"                                    />
        <KpiCard label="נסגרו"       value={closed}       accent="border-emerald-900/60" sub={closed > 0 ? "💰 הכנסה" : undefined}    />
        <KpiCard label="יחס המרה"    value={`${convPct}%`} accent="border-slate-800"     sub="מהפייפליין"                 />
      </div>
      <div className="space-y-1.5">
        <PipelineBar statuses={statuses} />
        <div className="flex gap-4 flex-wrap">
          {STATUSES.map((s) => {
            const count = s.value === "new"
              ? vals.filter((v) => v === "new").length + (total - vals.length)
              : vals.filter((v) => v === s.value).length;
            return (
              <span key={s.value} className="flex items-center gap-1.5 text-xs text-slate-500 font-heebo">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                {s.label} ({count})
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Business Card ────────────────────────────────────────────────────────────

function BusinessCard({
  lead, status, onStatusChange, origin,
}: {
  lead: Lead; status: Status; onStatusChange: (slug: string, s: Status) => void; origin: string;
}) {
  const [copied, setCopied]               = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);
  const niche      = detectNiche(lead.slug);
  const nicheMeta  = NICHE_META[niche] ?? NICHE_META.fitness;
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
    <article className="group relative bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden hover:border-slate-700 transition-colors duration-150 transform-gpu contain-content">

      {/* Colored top accent line by niche */}
      <div className={`h-0.5 w-full ${
        niche === "clinic"      ? "bg-gradient-to-r from-teal-500 to-teal-400" :
        niche === "photography" ? "bg-gradient-to-r from-rose-500 to-rose-400" :
        niche === "craft"       ? "bg-gradient-to-r from-amber-500 to-amber-400" :
        niche === "finance"     ? "bg-gradient-to-r from-blue-500 to-blue-400" :
                                  "bg-gradient-to-r from-lime-500 to-lime-400"
      }`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base leading-tight truncate font-heebo">
              {lead.businessName}
            </h3>
            <p className="text-slate-400 text-sm mt-0.5 font-heebo tabular-nums">{lead.contact.phone}</p>
          </div>
          <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${nicheMeta.bg} ${nicheMeta.color} font-heebo`}>
            {nicheMeta.label}
          </span>
        </div>

        {/* Address */}
        {lead.contact.address && (
          <p className="text-slate-500 text-xs truncate font-heebo -mt-2">
            📍 {lead.contact.address}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(lead.rating) ? "text-amber-400" : "text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-amber-400 text-xs font-bold font-heebo">{lead.rating}</span>
          <span className="text-slate-600 text-xs font-heebo">({lead.reviewCount})</span>
        </div>

        {/* Status selector */}
        <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ring-1 bg-slate-800/60 ${statusMeta.ring} transition-all duration-150`}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusMeta.dot}`} />
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
          {/* Status badge */}
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border font-heebo ${STATUS_BADGE[status]}`}>
            {statusMeta.label}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2">
          <a
            href={`/p/${lead.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="צפה בדף"
            className="flex flex-col items-center justify-center gap-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl transition-colors duration-150 font-heebo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <span className="text-[10px]">צפה</span>
          </a>
          <button
            onClick={handleCopy}
            title="העתק קישור"
            className={`flex flex-col items-center justify-center gap-0.5 border py-2.5 rounded-xl transition-colors duration-150 font-heebo ${
              copied
                ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-400"
                : "bg-slate-800 hover:bg-slate-700 border-slate-700/50 text-slate-400 hover:text-slate-200"
            }`}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
            <span className="text-[10px]">{copied ? "הועתק" : "קישור"}</span>
          </button>
          <button
            onClick={handleCopyMessage}
            title="העתק הודעת WA"
            className={`flex flex-col items-center justify-center gap-0.5 border py-2.5 rounded-xl transition-colors duration-150 font-heebo ${
              messageCopied
                ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-400"
                : "bg-slate-800 hover:bg-slate-700 border-slate-700/50 text-slate-400 hover:text-slate-200"
            }`}
          >
            {messageCopied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            )}
            <span className="text-[10px]">{messageCopied ? "הועתק" : "הודעה"}</span>
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            title="שלח ב-WhatsApp"
            className="flex flex-col items-center justify-center gap-0.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl transition-colors duration-150 font-heebo shadow-lg shadow-emerald-950/50"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="text-[10px]">שלח</span>
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Search & Filter Toolbar ──────────────────────────────────────────────────

function Toolbar({
  search, setSearch,
  nicheFilter, setNicheFilter,
  statusFilter, setStatusFilter,
  total, filtered,
}: {
  search: string; setSearch: (v: string) => void;
  nicheFilter: string; setNicheFilter: (v: string) => void;
  statusFilter: "הכל" | Status; setStatusFilter: (v: "הכל" | Status) => void;
  total: number; filtered: number;
}) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Search */}
      <div className="relative">
        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="חיפוש לפי שם עסק..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-slate-600 text-white placeholder-slate-500 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600/50 transition-colors font-heebo"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {/* Filter pills row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Niche filter */}
        <div className="flex gap-1.5 flex-wrap">
          {NICHE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setNicheFilter(n)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors duration-150 font-heebo ${
                nicheFilter === n
                  ? "bg-white text-slate-900 border-white"
                  : "bg-transparent text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="sm:mr-auto flex gap-1.5 flex-wrap">
          {/* Status filter */}
          {([{ value: "הכל", label: "כל הסטטוסים" }, ...STATUSES.map(s => ({ value: s.value, label: s.label }))] as { value: string; label: string }[]).map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value as "הכל" | Status)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors duration-150 font-heebo ${
                statusFilter === s.value
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-transparent text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-600 font-heebo">
        {filtered === total ? `${total} עסקים` : `${filtered} מתוך ${total}`}
      </p>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 font-heebo">
      <button
        onClick={() => onPage(page - 1)} disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm font-medium disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-slate-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        קודם
      </button>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p} onClick={() => onPage(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
              p === page
                ? "bg-white text-slate-900"
                : "bg-slate-900 border border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm font-medium disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-slate-200 transition-colors"
      >
        הבא
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [statuses, setStatuses]           = useState<StatusMap>({});
  const [search, setSearch]               = useState("");
  const [nicheFilter, setNicheFilter]     = useState("הכל");
  const [statusFilter, setStatusFilter]   = useState<"הכל" | Status>("הכל");
  const [origin, setOrigin]               = useState("");
  const [page, setPage]                   = useState(1);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_BASE_URL || window.location.origin);
    async function load() {
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from("businesses")
            .select("slug, status") as { data: { slug: string; status: string }[] | null; error: unknown };
          if (!error && data && data.length > 0) {
            const map: StatusMap = {};
            data.forEach((r) => { map[r.slug] = r.status as Status; });
            setStatuses(map);
            setSupabaseReady(true);
            return;
          }
        } catch {}
      }
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setStatuses(JSON.parse(raw));
      } catch {}
    }
    load();
  }, []);

  const handleStatusChange = async (slug: string, s: Status) => {
    const next = { ...statuses, [slug]: s };
    setStatuses(next);
    setSaving(true);
    if (supabaseReady) {
      const sb = getSupabase();
      if (sb) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sb as any).from("businesses").update({ status: s }).eq("slug", slug);
      }
    }
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
    setTimeout(() => setSaving(false), 600);
  };

  const getStatus = (slug: string): Status => statuses[slug] ?? "new";

  const filtered = useMemo(() => {
    return pagesData.filter((lead) => {
      const nicheName = NICHE_META[detectNiche(lead.slug)]?.label ?? "";
      if (search && !lead.businessName.toLowerCase().includes(search.toLowerCase())) return false;
      if (nicheFilter !== "הכל" && nicheName !== nicheFilter) return false;
      if (statusFilter !== "הכל" && getStatus(lead.slug) !== statusFilter) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, nicheFilter, statusFilter, statuses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [search, nicheFilter, statusFilter]);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-heebo" dir="rtl">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm font-heebo">לוח בקרה</span>
            <span className="hidden sm:block text-slate-600 text-sm">/</span>
            <span className="hidden sm:block text-slate-400 text-sm font-heebo">ניהול לידים</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Saving indicator */}
            {saving && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-heebo">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                שומר...
              </span>
            )}
            {supabaseReady && !saving && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-heebo">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs text-slate-500 font-heebo tabular-nums">
              {pagesData.length} עסקים
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* KPI + Pipeline */}
        <KpiStrip statuses={statuses} />

        {/* Toolbar */}
        <Toolbar
          search={search} setSearch={setSearch}
          nicheFilter={nicheFilter} setNicheFilter={setNicheFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          total={pagesData.length} filtered={filtered.length}
        />

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-600">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm font-heebo">לא נמצאו עסקים התואמים את הסינון</p>
            <button onClick={() => { setSearch(""); setNicheFilter("הכל"); setStatusFilter("הכל"); }}
              className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 font-heebo transition-colors">
              נקה סינון
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
