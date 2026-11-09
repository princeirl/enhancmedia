"use client";

import { useState, type ReactNode } from "react";

export function WorkFilter({
  categories,
  items,
  allLabel,
  groupLabel,
}: {
  categories: readonly string[];
  allLabel: string;
  groupLabel: string;
  items: { key: string; category: string; node: ReactNode }[];
}) {
  const [active, setActive] = useState<string>(allLabel);
  const present = categories.filter((c) => items.some((i) => i.category === c));
  const shown = active === allLabel ? items : items.filter((i) => i.category === active);
  return (
    <>
      <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-2">
        {[allLabel, ...present].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
              active === c ? "border-ink bg-ink text-white" : "border-line bg-white text-charcoal hover:border-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
      <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((i) => (
          <div key={i.key}>{i.node}</div>
        ))}
      </div>
    </>
  );
}
