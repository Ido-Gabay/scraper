export type NicheType = "clinic" | "photography" | "craft" | "finance" | "fitness";

export interface NicheTheme {
    niche: NicheType;
    // Page
    pageBg: string;
    // Hero overlay (on top of background image)
    heroOverlay: string;
    ratingPillBg: string;
    ratingPillBorder: string;
    eyebrowColor: string;
    heroSubColor: string;
    heroBusinessNameColor: string;
    // Sections
    aboutBg: string;
    aboutCardBg: string;
    aboutCardBorder: string;
    servicesBg: string;
    serviceCardBg: string;
    serviceCardBorder: string;
    serviceCardHover: string;
    serviceIconBg: string;
    serviceIconBorder: string;
    serviceIconColor: string;
    testimonialsBg: string;
    testimonialCardBg: string;
    testimonialCardBorder: string;
    contactBg: string;
    contactSubColor: string;
    contactInfoColor: string;
    // Text
    sectionHeadingColor: string;
    sectionSubColor: string;
    bodyTextColor: string;
    // CTA button
    ctaBg: string;
    ctaHover: string;
    ctaText: string;
    ctaShadow: string;
    ctaHoverShadow: string;
    // Sticky bar
    stickyBg: string;
    stickyBorder: string;
    // Niche labels (copy)
    galleryEyebrow: string;
    galleryTitle: string;
    aboutEyebrow: string;
    servicesEyebrow: string;
    servicesTitle: string;
    testimonialsEyebrow: string;
    contactEyebrow: string;
}

const THEMES: Record<NicheType, NicheTheme> = {
    clinic: {
        niche: "clinic",
        pageBg: "bg-white",
        heroOverlay: "bg-gradient-to-b from-teal-950/80 via-teal-900/60 to-white",
        ratingPillBg: "bg-teal-900/60",
        ratingPillBorder: "border-teal-400/30",
        eyebrowColor: "text-teal-500",
        heroSubColor: "text-teal-100",
        heroBusinessNameColor: "text-teal-300/70",
        aboutBg: "bg-teal-50/50",
        aboutCardBg: "bg-white",
        aboutCardBorder: "border border-teal-100 shadow-sm",
        servicesBg: "bg-white",
        serviceCardBg: "bg-teal-50/60",
        serviceCardBorder: "border border-teal-100",
        serviceCardHover: "hover:bg-teal-50 hover:shadow-md hover:border-teal-300 hover:-translate-y-1",
        serviceIconBg: "bg-teal-100",
        serviceIconBorder: "border border-teal-200",
        serviceIconColor: "text-teal-600",
        testimonialsBg: "bg-teal-50",
        testimonialCardBg: "bg-white",
        testimonialCardBorder: "border border-teal-100",
        contactBg: "bg-teal-900",
        contactSubColor: "text-teal-300",
        contactInfoColor: "text-teal-200",
        sectionHeadingColor: "text-slate-900",
        sectionSubColor: "text-slate-500",
        bodyTextColor: "text-slate-600",
        ctaBg: "bg-teal-500",
        ctaHover: "hover:bg-teal-600",
        ctaText: "text-white",
        ctaShadow: "shadow-lg shadow-teal-500/30",
        ctaHoverShadow: "hover:shadow-teal-500/50",
        stickyBg: "bg-white/95",
        stickyBorder: "border-teal-100",
        galleryEyebrow: "הטיפולים שלנו",
        galleryTitle: "עבודות וטיפולים נבחרים",
        aboutEyebrow: "הסיפור שלנו",
        servicesEyebrow: "מה אנחנו מציעים",
        servicesTitle: "השירותים שלנו",
        testimonialsEyebrow: "מטופלים ממליצים",
        contactEyebrow: "קביעת תור",
    },

    photography: {
        niche: "photography",
        pageBg: "bg-neutral-950",
        heroOverlay: "bg-gradient-to-b from-black/80 via-black/55 to-neutral-950",
        ratingPillBg: "bg-white/10",
        ratingPillBorder: "border-white/20",
        eyebrowColor: "text-rose-300",
        heroSubColor: "text-neutral-300",
        heroBusinessNameColor: "text-neutral-500",
        aboutBg: "bg-neutral-950",
        aboutCardBg: "bg-white/5",
        aboutCardBorder: "border border-white/10",
        servicesBg: "bg-neutral-900",
        serviceCardBg: "bg-neutral-800/60",
        serviceCardBorder: "border border-white/10",
        serviceCardHover: "hover:bg-white/10 hover:border-rose-400/30 hover:-translate-y-1",
        serviceIconBg: "bg-rose-400/10",
        serviceIconBorder: "border border-rose-400/20",
        serviceIconColor: "text-rose-400",
        testimonialsBg: "bg-neutral-950",
        testimonialCardBg: "bg-white/5",
        testimonialCardBorder: "border border-white/10",
        contactBg: "bg-neutral-900",
        contactSubColor: "text-neutral-400",
        contactInfoColor: "text-neutral-300",
        sectionHeadingColor: "text-white",
        sectionSubColor: "text-neutral-500",
        bodyTextColor: "text-neutral-300",
        ctaBg: "bg-rose-500",
        ctaHover: "hover:bg-rose-600",
        ctaText: "text-white",
        ctaShadow: "shadow-lg shadow-rose-500/30",
        ctaHoverShadow: "hover:shadow-rose-500/50",
        stickyBg: "bg-neutral-950/95",
        stickyBorder: "border-white/10",
        galleryEyebrow: "עבודות שנבחרו",
        galleryTitle: "הגלריה שלנו",
        aboutEyebrow: "הסיפור שלנו",
        servicesEyebrow: "מה כלול",
        servicesTitle: "חבילות הצילום",
        testimonialsEyebrow: "לקוחות שצוות אצלנו",
        contactEyebrow: "בדיקת זמינות",
    },

    craft: {
        niche: "craft",
        pageBg: "bg-stone-950",
        heroOverlay: "bg-gradient-to-b from-stone-950/70 via-amber-950/40 to-stone-950",
        ratingPillBg: "bg-amber-950/60",
        ratingPillBorder: "border-amber-400/30",
        eyebrowColor: "text-amber-400",
        heroSubColor: "text-stone-300",
        heroBusinessNameColor: "text-stone-500",
        aboutBg: "bg-stone-950",
        aboutCardBg: "bg-white/5",
        aboutCardBorder: "border border-amber-900/30",
        servicesBg: "bg-stone-900",
        serviceCardBg: "bg-stone-800/50",
        serviceCardBorder: "border border-amber-900/20",
        serviceCardHover: "hover:bg-amber-950/40 hover:border-amber-600/30 hover:-translate-y-1",
        serviceIconBg: "bg-amber-400/10",
        serviceIconBorder: "border border-amber-400/20",
        serviceIconColor: "text-amber-400",
        testimonialsBg: "bg-stone-950",
        testimonialCardBg: "bg-stone-800/40",
        testimonialCardBorder: "border border-amber-900/20",
        contactBg: "bg-stone-900",
        contactSubColor: "text-stone-400",
        contactInfoColor: "text-stone-300",
        sectionHeadingColor: "text-white",
        sectionSubColor: "text-stone-500",
        bodyTextColor: "text-stone-300",
        ctaBg: "bg-amber-500",
        ctaHover: "hover:bg-amber-400",
        ctaText: "text-stone-950 font-black",
        ctaShadow: "shadow-lg shadow-amber-500/30",
        ctaHoverShadow: "hover:shadow-amber-500/50",
        stickyBg: "bg-stone-950/95",
        stickyBorder: "border-amber-900/30",
        galleryEyebrow: "עבודות שנגרו",
        galleryTitle: "פרויקטים נבחרים",
        aboutEyebrow: "מי אנחנו",
        servicesEyebrow: "מה אנחנו עושים",
        servicesTitle: "השירותים שלנו",
        testimonialsEyebrow: "לקוחות ממליצים",
        contactEyebrow: "פגישת תכנון",
    },

    finance: {
        niche: "finance",
        pageBg: "bg-slate-950",
        heroOverlay: "bg-gradient-to-b from-blue-950/85 via-slate-900/70 to-slate-950",
        ratingPillBg: "bg-blue-900/50",
        ratingPillBorder: "border-blue-400/30",
        eyebrowColor: "text-blue-300",
        heroSubColor: "text-slate-300",
        heroBusinessNameColor: "text-slate-500",
        aboutBg: "bg-slate-900",
        aboutCardBg: "bg-white/5",
        aboutCardBorder: "border border-blue-900/30",
        servicesBg: "bg-slate-950",
        serviceCardBg: "bg-slate-800/60",
        serviceCardBorder: "border border-blue-900/20",
        serviceCardHover: "hover:bg-blue-950/50 hover:border-blue-500/30 hover:-translate-y-1",
        serviceIconBg: "bg-blue-400/10",
        serviceIconBorder: "border border-blue-400/20",
        serviceIconColor: "text-blue-400",
        testimonialsBg: "bg-slate-900",
        testimonialCardBg: "bg-slate-800/50",
        testimonialCardBorder: "border border-blue-900/20",
        contactBg: "bg-slate-900",
        contactSubColor: "text-slate-400",
        contactInfoColor: "text-slate-300",
        sectionHeadingColor: "text-white",
        sectionSubColor: "text-slate-500",
        bodyTextColor: "text-slate-300",
        ctaBg: "bg-orange-500",
        ctaHover: "hover:bg-orange-400",
        ctaText: "text-white",
        ctaShadow: "shadow-lg shadow-orange-500/30",
        ctaHoverShadow: "hover:shadow-orange-500/50",
        stickyBg: "bg-slate-950/95",
        stickyBorder: "border-blue-900/30",
        galleryEyebrow: "הסביבה שלנו",
        galleryTitle: "מקום של שקט ורוגע",
        aboutEyebrow: "מי אנחנו",
        servicesEyebrow: "איך עובד התהליך",
        servicesTitle: "שלבי העבודה",
        testimonialsEyebrow: "לקוחות שחסכו",
        contactEyebrow: "ייעוץ ראשוני",
    },

    fitness: {
        niche: "fitness",
        pageBg: "bg-zinc-950",
        heroOverlay: "bg-gradient-to-b from-black/85 via-black/60 to-zinc-950",
        ratingPillBg: "bg-white/10",
        ratingPillBorder: "border-lime-400/30",
        eyebrowColor: "text-lime-400",
        heroSubColor: "text-zinc-300",
        heroBusinessNameColor: "text-zinc-500",
        aboutBg: "bg-zinc-900",
        aboutCardBg: "bg-zinc-800/50",
        aboutCardBorder: "border border-lime-900/20",
        servicesBg: "bg-zinc-950",
        serviceCardBg: "bg-zinc-800/60",
        serviceCardBorder: "border border-zinc-700",
        serviceCardHover: "hover:bg-zinc-700/60 hover:border-lime-500/30 hover:-translate-y-1",
        serviceIconBg: "bg-lime-400/10",
        serviceIconBorder: "border border-lime-400/20",
        serviceIconColor: "text-lime-400",
        testimonialsBg: "bg-zinc-900",
        testimonialCardBg: "bg-zinc-800/50",
        testimonialCardBorder: "border border-zinc-700",
        contactBg: "bg-zinc-900",
        contactSubColor: "text-zinc-400",
        contactInfoColor: "text-zinc-300",
        sectionHeadingColor: "text-white",
        sectionSubColor: "text-zinc-500",
        bodyTextColor: "text-zinc-300",
        ctaBg: "bg-lime-500",
        ctaHover: "hover:bg-lime-400",
        ctaText: "text-zinc-950 font-black",
        ctaShadow: "shadow-lg shadow-lime-500/30",
        ctaHoverShadow: "hover:shadow-lime-500/50",
        stickyBg: "bg-zinc-950/95",
        stickyBorder: "border-zinc-700",
        galleryEyebrow: "תמונות מהסטודיו",
        galleryTitle: "האווירה שלנו",
        aboutEyebrow: "מי אנחנו",
        servicesEyebrow: "מה תקבלו",
        servicesTitle: "תוכניות האימון",
        testimonialsEyebrow: "תוצאות אמיתיות",
        contactEyebrow: "אימון ניסיון",
    },
};

export function detectNiche(slug: string): NicheType {
    const s = slug.toLowerCase();
    if (s.includes("marpea") || s.includes("dental") || s.includes("clinic") || s.includes("aesthetic")) return "clinic";
    if (s.includes("photo") || s.includes("tamna") || s.includes("inspire") || s.includes("event")) return "photography";
    if (s.includes("nagar") || s.includes("hanagar") || s.includes("yaakov") || s.includes("amit")) return "craft";
    if (s.includes("mashkant") || s.includes("blank") || s.includes("chagoel") || s.includes("finance")) return "finance";
    return "fitness";
}

export function getTheme(slug: string): NicheTheme {
    return THEMES[detectNiche(slug)];
}
