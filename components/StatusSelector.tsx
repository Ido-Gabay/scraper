'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { BusinessStatus } from '@/lib/supabaseClient';

const STATUSES: { value: BusinessStatus; label: string; dot: string }[] = [
  { value: "new",         label: "חדש",            dot: "bg-slate-400"   },
  { value: "sent",        label: "נשלח ללקוח",     dot: "bg-blue-400"    },
  { value: "negotiating", label: "במשא ומתן",      dot: "bg-amber-400"   },
  { value: "closed",      label: "נסגר / שולם",    dot: "bg-emerald-400" },
  { value: "irrelevant",  label: "לא רלוונטי",     dot: "bg-red-400"     },
];

export function StatusSelector({
  value,
  onChange,
}: {
  value: BusinessStatus;
  onChange: (status: BusinessStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedStatus = STATUSES.find((s) => s.value === value) || STATUSES[0];

  // Calculate menu position when opening or on scroll/resize
  const updateMenuPosition = useCallback(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 280; // approximate dropdown width
      const padding = 8;
      
      // Calculate optimal horizontal position
      let left = rect.left;
      
      // If menu would go off-screen to the right, align to right edge of button
      if (rect.left + menuWidth > window.innerWidth - padding) {
        left = window.innerWidth - menuWidth - padding;
      }
      
      // Make sure menu doesn't go off-screen to the left
      if (left < padding) {
        left = padding;
      }

      // Calculate vertical position (below button)
      let top = rect.bottom + 8;
      
      // If menu would go off-screen at bottom, position above button
      const menuHeight = STATUSES.length * 44 + 12; // approximate height
      if (top + menuHeight > window.innerHeight - padding) {
        top = rect.top - menuHeight - 8;
      }

      setMenuPosition({
        top,
        left,
        width: Math.max(rect.width, 200),
      });
    }
  }, [open]);


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    updateMenuPosition();
  }, [open, updateMenuPosition]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!open) return;

    const handleScroll = updateMenuPosition;
    const handleResize = updateMenuPosition;

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || !buttonRef.current?.contains(document.activeElement as Node)) {
        return;
      }

      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }

      const currentIndex = STATUSES.findIndex((s) => s.value === value);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % STATUSES.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + STATUSES.length) % STATUSES.length;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setOpen(false);
        return;
      }

      onChange(STATUSES[nextIndex].value);
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, value, onChange]);

  const handleSelect = useCallback((status: BusinessStatus) => {
    onChange(status);
    setOpen(false);
  }, [onChange]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 ring-1 transition-all duration-150 font-heebo font-medium text-sm ${
          open
            ? 'bg-slate-700 border-slate-600 ring-slate-600 text-white shadow-md shadow-slate-900/50'
            : 'bg-slate-800/60 border-slate-700/50 ring-slate-700/30 text-slate-200 hover:bg-slate-700 hover:ring-slate-600'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedStatus.dot}`}
          />
          <span className="truncate">{selectedStatus.label}</span>
        </div>
        <svg
          className={`w-4 h-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu — Rendered via Portal to avoid overflow: hidden */}
      {mounted && open && createPortal(
        <div
          className="fixed z-50 min-w-max animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
          }}
        >
          <div className="rounded-xl bg-slate-800/95 border border-slate-700/50 overflow-hidden shadow-lg shadow-black/40 backdrop-blur-sm">
            <div className="py-1.5">
              {STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleSelect(status.value)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left font-heebo transition-colors duration-100 ${
                    value === status.value
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                  }`}
                  role="option"
                  aria-selected={value === status.value}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${status.dot}`} />
                  <span className="flex-1">{status.label}</span>
                  {value === status.value && (
                    <svg
                      className="w-4 h-4 shrink-0 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
