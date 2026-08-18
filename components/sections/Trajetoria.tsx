"use client";

import { useRef } from "react";
import { siteData } from "@/content/site-data";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineItem } from "@/components/ui/TimelineItem";

export function Trajetoria() {
  const listRef = useRef<HTMLDivElement>(null);
  const total = siteData.trajetoria.length;

  return (
    <section id="trajetoria" className="py-24 md:py-32 bg-charcoal/40 border-y border-warm-gray/20">
      <div className="mx-auto max-w-6xl px-6 md:px-10 grid md:grid-cols-[260px_minmax(0,1fr)] gap-16">
        <div className="md:sticky md:top-28 self-start">
          <SectionHeading eyebrow="Trajetória" heading="Trajetória Profissional" />
          <p className="mt-6 hidden md:block text-sm text-warm-gray tabular-nums">
            01 — {String(total).padStart(2, "0")}
          </p>
        </div>
        <div ref={listRef} className="relative">
          <DrawLine containerRef={listRef} className="left-0" />
          {siteData.trajetoria.map((entry, index) => (
            <Reveal key={entry.id} delay={Math.min(index * 0.05, 0.3)}>
              <TimelineItem entry={entry} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
