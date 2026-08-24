"use client";
import { useState } from "react";
import type { NicheTheme } from "@/lib/niche";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({
  items,
  theme,
}: {
  items: FaqItem[];
  theme: NicheTheme;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-xl overflow-hidden border transition-all duration-200 ${theme.serviceCardBorder} ${open === i ? theme.serviceCardBg : theme.testimonialCardBg}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-right px-6 py-4 flex items-center justify-between gap-4"
          >
            <span className={`font-semibold text-base ${theme.sectionHeadingColor}`}>
              {item.q}
            </span>
            <span
              className={`text-sm shrink-0 transition-transform duration-300 ${theme.eyebrowColor} ${open === i ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className={`px-6 pb-5 text-sm leading-relaxed ${theme.bodyTextColor}`}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
