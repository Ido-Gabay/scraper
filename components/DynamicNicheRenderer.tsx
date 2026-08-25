import Image from "next/image";
import { getTheme, detectNiche, NicheTheme } from "@/lib/niche";
import pagesData from "@/data/pages_data.json";
import AnimatedCounter from "@/components/AnimatedCounter";
import FaqAccordion from "@/components/FaqAccordion";

type PageData = (typeof pagesData)[number];

// ─── Shared icons ────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function toWhatsAppHref(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

const SERVICE_ICON_PATHS = [
  "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
  "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125",
  "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
];

// ─── CTA button (shared) ─────────────────────────────────────────────────────

function CtaButton({
  href,
  label,
  theme,
  size = "lg",
}: {
  href: string;
  label: string;
  theme: NicheTheme;
  size?: "lg" | "sm";
}) {
  const base =
    size === "lg"
      ? "inline-flex items-center justify-center gap-2 sm:gap-3 font-bold text-base sm:text-lg px-6 sm:px-9 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
      : "flex items-center justify-center gap-2 w-full font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition-colors";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${theme.ctaBg} ${theme.ctaHover} ${theme.ctaText} ${theme.ctaShadow} ${theme.ctaHoverShadow}`}
    >
      <WhatsAppIcon className={size === "lg" ? "w-5 h-5 sm:w-6 sm:h-6" : "w-4 h-4 sm:w-5 sm:h-5"} />
      {label}
    </a>
  );
}

// ─── Section eyebrow label ────────────────────────────────────────────────────

function Eyebrow({ label, color }: { label: string; color: string }) {
  return (
    <p className={`text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-3 ${color}`}>
      {label}
    </p>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection({
  lead,
  theme,
  waHref,
}: {
  lead: PageData;
  theme: NicheTheme;
  waHref: string;
}) {
  return (
    <section className="relative min-h-screen sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
      <Image
        src={lead.heroImage}
        alt={lead.businessName}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className={`absolute inset-0 ${theme.heroOverlay}`} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-28 text-center">
        <div
          className={`inline-flex items-center gap-1.5 sm:gap-2 backdrop-blur-md border rounded-full px-3 sm:px-5 py-1.5 sm:py-2 mb-4 sm:mb-7 text-xs sm:text-sm ${theme.ratingPillBg} ${theme.ratingPillBorder}`}
        >
          <span className="text-amber-400 text-sm sm:text-base">⭐</span>
          <span className="font-semibold text-white tracking-wide">
            {lead.rating} &middot; {lead.reviewCount} ביקורות
          </span>
        </div>

        <Eyebrow label={lead.tagline} color={theme.eyebrowColor} />

        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-3 sm:mb-6 drop-shadow-lg">
          {lead.hero.title}
        </h1>

        <p className={`text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-12 leading-relaxed ${theme.heroSubColor}`}>
          {lead.hero.subtitle}
        </p>

        <CtaButton href={waHref} label={lead.hero.ctaText} theme={theme} />

        <p className={`mt-4 sm:mt-7 text-xs sm:text-sm ${theme.heroBusinessNameColor}`}>
          {lead.businessName}
        </p>
      </div>
    </section>
  );
}

// ─── Niche-specific interstitial strips ──────────────────────────────────────

function ClinicTrustStrip({ theme }: { theme: NicheTheme }) {
  const items = [
    "רופאים מוסמכים ומנוסים",
    "ציוד מהדור החדש",
    "ביקורות 5 כוכבים בגוגל",
    "ייעוץ ראשוני חינמי",
  ];
  return (
    <div className="bg-teal-600 py-3 sm:py-4 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 text-center">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm font-semibold">
            <span className="text-teal-200">✓</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CraftProcessSteps({ theme }: { theme: NicheTheme }) {
  const steps = [
    { n: "01", title: "פגישת תכנון ומדידה", desc: "מגיעים אליכם הביתה, מודדים, מקשיבים ומציגים הצעת עיצוב." },
    { n: "02", title: "ייצור בסטודיו", desc: "הריהוט מיוצר בבית המלאכה שלנו מחומרים איכותיים בדיוק מלא." },
    { n: "03", title: "התקנה מקצועית", desc: "הצוות מגיע, מתקין, מדייק עם פלס לייזר ולא עוזב עד שהכל מושלם." },
  ];
  return (
    <section className={`py-12 sm:py-20 px-4 sm:px-6 ${theme.servicesBg}`}>
      <div className="max-w-5xl mx-auto">
        <Eyebrow label="איך זה עובד" color={theme.eyebrowColor} />
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-14 ${theme.sectionHeadingColor}`}>
          תהליך העבודה שלנו
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <span className={`text-4xl sm:text-5xl font-black ${theme.eyebrowColor}`}>{s.n}</span>
              <h3 className={`text-lg sm:text-xl font-bold ${theme.sectionHeadingColor}`}>{s.title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.bodyTextColor}`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinanceTrustStats({ lead, theme }: { lead: PageData; theme: NicheTheme }) {
  return (
    <div className="bg-blue-900/30 border-y border-blue-800/30 py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
        {([
          { target: lead.reviewCount, suffix: "+", label: "לקוחות מרוצים" },
          { target: Math.round(lead.rating * 10), suffix: "★", divisor: 10, label: "דירוג בגוגל" },
          { target: 10, suffix: "+", label: "בנקים עמם עובדים" },
          { target: 0, suffix: " ₪", label: "עמלה מהבנק" },
        ] as const).map((s, i) => (
          <div key={i}>
            <p className="text-2xl sm:text-3xl font-black text-white mb-1">
              {s.target === 0 ? (
                <span>0 ₪</span>
              ) : (
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              )}
            </p>
            <p className={`text-xs sm:text-sm ${theme.sectionSubColor}`}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FitnessStatsStrip({ lead, theme }: { lead: PageData; theme: NicheTheme }) {
  return (
    <div className="bg-lime-500 py-4 sm:py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
        {([
          { target: lead.reviewCount, suffix: "", label: "לקוחות פעילים" },
          { target: Math.round(lead.rating * 10), suffix: "★", label: "דירוג בגוגל" },
          { target: 100, suffix: "%", label: "מחויבות לתוצאות" },
          { target: 7, suffix: "/7", label: "ימי אימון בשבוע" },
        ] as const).map((s, i) => (
          <div key={i}>
            <p className="text-2xl sm:text-3xl font-black text-zinc-950 mb-0.5">
              <AnimatedCounter target={s.target} suffix={s.suffix} />
            </p>
            <p className="text-xs sm:text-sm font-semibold text-zinc-800">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Urgency banner ───────────────────────────────────────────────────────────

const URGENCY: Record<string, { text: string; bg: string }> = {
  clinic:      { text: "✅ ייעוץ ראשון ללא עלות — פגישה אישית עם הרופאה. מקומות מוגבלים!", bg: "bg-teal-600" },
  photography: { text: "📅 מקומות מוגבלים לעונת חתונות הקרובה — בדקו זמינות עכשיו!",      bg: "bg-rose-600" },
  craft:       { text: "🔨 ביקור בית וייעוץ עיצוב ראשוני — ללא עלות. השאירו פרטים!",        bg: "bg-amber-600" },
  finance:     { text: "💰 ייעוץ ראשון חינמי — חיסכון ממוצע של ₪50,000 במשכנתא!",          bg: "bg-blue-700" },
  fitness:     { text: "💪 אימון ניסיון חינמי — הצטרפו לקבוצה המנצחת. מקומות מוגבלים!",    bg: "bg-lime-600" },
};

function UrgencyBanner({ niche, waHref }: { niche: string; waHref: string }) {
  const banner = URGENCY[niche] ?? URGENCY.fitness;
  return (
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full text-center py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold text-white tracking-wide hover:brightness-110 transition-all duration-200 ${banner.bg}`}
    >
      {banner.text}
    </a>
  );
}


// ─── FAQ section (finance / services niches) ──────────────────────────────────

const FINANCE_FAQ = [
  { q: "כמה עולה הייעוץ?", a: "ייעוץ ראשוני הוא חינמי לחלוטין. שכר הייעוץ מסוכם מראש ומשולם רק לאחר קבלת אישור המשכנתא." },
  { q: "כמה זמן לוקח תהליך המשכנתא?", a: "תהליך טיפוסי אורך 2–4 שבועות מהפגישה הראשונה ועד החתימה בבנק, בהתאם למורכבות העסקה." },
  { q: "עם אילו בנקים אתם עובדים?", a: "אנו עובדים עם כל הבנקים הגדולים ומנהלים מכרז תחרותי ביניהם — כדי להביא לכם את התנאים הטובים ביותר." },
  { q: "האם ניתן גם למחזר משכנתא קיימת?", a: "בהחלט! מחזור משכנתא הוא אחד השירותים הנפוצים ביותר שלנו — לעיתים קרובות ניתן לחסוך אלפי שקלים בהחזר החודשי." },
];

function FinanceFaqSection({ theme }: { theme: NicheTheme }) {
  return (
    <section className={`py-12 sm:py-20 px-4 sm:px-6 ${theme.aboutBg}`}>
      <div className="max-w-3xl mx-auto animate-section animate-section-d1">
        <Eyebrow label="שאלות נפוצות" color={`text-center ${theme.eyebrowColor}`} />
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 ${theme.sectionHeadingColor}`}>
          כל מה שרצית לדעת
        </h2>
        <FaqAccordion items={FINANCE_FAQ} theme={theme} />
      </div>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

function GallerySection({ lead, theme }: { lead: PageData; theme: NicheTheme }) {
  return (
    <section className={`py-12 sm:py-16 px-4 sm:px-6 ${theme.pageBg} animate-section`}>
      <div className="max-w-6xl mx-auto">
        <Eyebrow label={theme.galleryEyebrow} color={`text-center ${theme.eyebrowColor}`} />
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-10 ${theme.sectionHeadingColor}`}>
          {theme.galleryTitle}
        </h2>
        {/* aspect-[4/3] on every cell guarantees identical proportions regardless of source image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {lead.galleryImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800"
            >
              <Image
                src={`https://images.unsplash.com/${img.id}?w=800&q=80`}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function AboutSection({ lead, theme }: { lead: PageData; theme: NicheTheme }) {
  return (
    <section className={`relative py-12 sm:py-24 px-4 sm:px-6 overflow-hidden ${theme.aboutBg} animate-section animate-section-d1`}>
      <div className="relative max-w-3xl mx-auto">
        <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 ${theme.aboutCardBg} ${theme.aboutCardBorder}`}>
          <Eyebrow label={theme.aboutEyebrow} color={theme.eyebrowColor} />
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 ${theme.sectionHeadingColor}`}>
            {lead.about.title}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${theme.bodyTextColor}`}>
            {lead.about.description}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────

function ServicesSection({ lead, theme }: { lead: PageData; theme: NicheTheme }) {
  return (
    <section className={`py-12 sm:py-24 px-4 sm:px-6 ${theme.servicesBg} animate-section`}>
      <div className="max-w-5xl mx-auto">
        <Eyebrow label={theme.servicesEyebrow} color={`text-center ${theme.eyebrowColor}`} />
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-14 ${theme.sectionHeadingColor}`}>
          {theme.servicesTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {lead.services.map((service, i) => (
            <div
              key={service.title}
              className={`rounded-xl sm:rounded-2xl p-5 sm:p-8 transition-all duration-300 ${theme.serviceCardBg} ${theme.serviceCardBorder} ${theme.serviceCardHover}`}
            >
              <div
                className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 ${theme.serviceIconBg} ${theme.serviceIconBorder}`}
              >
                <svg
                  className={`w-6 sm:w-7 h-6 sm:h-7 ${theme.serviceIconColor}`}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={SERVICE_ICON_PATHS[i % SERVICE_ICON_PATHS.length]} />
                </svg>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${theme.sectionHeadingColor}`}>
                {service.title}
              </h3>
              <p className={`leading-relaxed text-xs sm:text-sm ${theme.bodyTextColor}`}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection({ lead, theme }: { lead: PageData; theme: NicheTheme }) {
  return (
    <section className={`py-12 sm:py-24 px-4 sm:px-6 ${theme.testimonialsBg} animate-section animate-section-d1`}>
      <div className="max-w-5xl mx-auto">
        <Eyebrow label={theme.testimonialsEyebrow} color={`text-center ${theme.eyebrowColor}`} />
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-3 ${theme.sectionHeadingColor}`}>
          מה הלקוחות אומרים
        </h2>
        <p className={`text-center mb-8 sm:mb-14 text-xs sm:text-sm ${theme.sectionSubColor}`}>ביקורות אמיתיות מגוגל</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {lead.testimonials.map((t, i) => (
            <div
              key={i}
              className={`rounded-xl sm:rounded-2xl p-5 sm:p-8 flex flex-col ${theme.testimonialCardBg} ${theme.testimonialCardBorder}`}
            >
              <div className="flex gap-0.5 mb-3 sm:mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <StarIcon key={s} />
                ))}
              </div>
              <p className={`leading-relaxed text-sm sm:text-base flex-1 ${theme.bodyTextColor}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className={`mt-3 sm:mt-5 text-xs sm:text-sm font-semibold border-t pt-3 sm:pt-4 ${theme.sectionSubColor} border-current/10`}>
                — {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function ContactSection({
  lead,
  theme,
  waHref,
}: {
  lead: PageData;
  theme: NicheTheme;
  waHref: string;
}) {
  return (
    <section className={`relative py-12 sm:py-24 px-4 sm:px-6 ${theme.contactBg}`}>
      <div className="relative max-w-2xl mx-auto text-center">
        <Eyebrow label={theme.contactEyebrow} color={`text-center ${theme.eyebrowColor}`} />
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 ${theme.sectionHeadingColor}`}>
          צרו קשר
        </h2>
        <p className={`mb-6 sm:mb-10 text-sm sm:text-base ${theme.contactSubColor}`}>נשמח לענות על כל שאלה ולתאם</p>

        <div className={`flex flex-col items-center gap-2 sm:gap-3 mb-6 sm:mb-10 text-sm sm:text-base ${theme.contactInfoColor}`}>
          {lead.contact.address && (
            <p className="flex items-center gap-1.5 sm:gap-2">
              <span aria-hidden="true">📍</span>
              {lead.contact.address}
            </p>
          )}
          <p className="flex items-center gap-1.5 sm:gap-2">
            <span aria-hidden="true">📞</span>
            <a
              href={`tel:${lead.contact.phone}`}
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              {lead.contact.phone}
            </a>
          </p>
        </div>

        <CtaButton href={waHref} label={lead.hero.ctaText} theme={theme} />
      </div>
    </section>
  );
}


// ─── DynamicNicheRenderer (main export) ──────────────────────────────────────

export default function DynamicNicheRenderer({ lead }: { lead: PageData }) {
  const theme = getTheme(lead.slug);
  const niche = detectNiche(lead.slug);
  const waHref = toWhatsAppHref(lead.contact.phone, lead.contact.whatsappMessage);

  return (
    <div className={`min-h-screen font-sans ${theme.pageBg}`}>
      {/* Urgency top banner — drives first-click conversions */}
      <UrgencyBanner niche={niche} waHref={waHref} />

      <HeroSection lead={lead} theme={theme} waHref={waHref} />

      {/* Niche interstitial strips */}
      {niche === "clinic" && <ClinicTrustStrip theme={theme} />}
      {niche === "fitness" && <FitnessStatsStrip lead={lead} theme={theme} />}
      {niche === "finance" && <FinanceTrustStats lead={lead} theme={theme} />}

      {/* Photography: gallery-first for immersive storytelling */}
      {niche === "photography" && <GallerySection lead={lead} theme={theme} />}

      <AboutSection lead={lead} theme={theme} />

      {/* Craft: 3-step process after about, before services */}
      {niche === "craft" && <CraftProcessSteps theme={theme} />}

      {/* Non-photography niches: gallery after about */}
      {niche !== "photography" && <GallerySection lead={lead} theme={theme} />}

      <ServicesSection lead={lead} theme={theme} />

      {/* Finance: FAQ accordion after services for trust/objection handling */}
      {niche === "finance" && <FinanceFaqSection theme={theme} />}

      {lead.testimonials.length > 0 && (
        <TestimonialsSection lead={lead} theme={theme} />
      )}

      <ContactSection lead={lead} theme={theme} waHref={waHref} />
    </div>
  );
}
