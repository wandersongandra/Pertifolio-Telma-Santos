import type { TimelineEntry } from "@/content/site-data";

export function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative pl-8 md:pl-10 pb-10 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-gold"
      />
      {entry.period && (
        <p className="text-sm font-semibold tracking-wide text-gold mb-1">
          {entry.period}
        </p>
      )}
      <h3 className="font-display text-xl md:text-2xl text-ivory mb-1 text-balance">
        {entry.title}
      </h3>
      {(entry.organization || entry.location) && (
        <p className="text-sm text-warm-gray mb-2">
          {[entry.organization, entry.location].filter(Boolean).join(" · ")}
        </p>
      )}
      <p className="text-ivory/80 leading-relaxed max-w-2xl">
        {entry.description}
      </p>
    </div>
  );
}
