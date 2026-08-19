import { cn } from "@/lib/utils";

interface AboutTimelineItem {
  title: string;
  value: string;
}

interface AboutTimelineProps {
  items: AboutTimelineItem[];
}

export function AboutTimeline({ items }: AboutTimelineProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-0 right-0 top-[26px] hidden h-px bg-gold/25 lg:block"
      />
      <ol className="grid gap-x-16 xl:gap-x-24 lg:grid-cols-[1fr_1.1fr_1.6fr]">
        {items.map((item, index) => (
          <li key={item.title} className="relative pl-9 pb-14 last:pb-0 lg:pl-0 lg:pb-0">
            {index < items.length - 1 && (
              <span
                aria-hidden
                className="absolute bottom-0 left-[2.5px] top-[6px] w-px bg-gold/25 lg:hidden"
              />
            )}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold lg:top-6"
            />
            <span className="mt-2 flex h-6 items-center text-xs font-semibold tracking-[0.18em] text-gold lg:mt-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className={cn(
                "mt-4 font-display leading-none tracking-[-0.025em] text-ivory lg:mt-8",
                index === 0
                  ? "text-[clamp(34px,2.6vw,48px)]"
                  : "text-[clamp(30px,2.2vw,42px)]"
              )}
            >
              {item.title}
            </h3>
            <p className="mt-3 max-w-[42ch] text-base leading-[1.45] text-ivory/70">
              {item.value}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}