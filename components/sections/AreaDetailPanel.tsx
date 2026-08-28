import type { AreaDetail } from "@/content/site-data";
import { DenseListIndex } from "@/components/ui/DenseListIndex";

const NUMBER_CLASS = "text-[11px] font-semibold tracking-[0.18em] text-gold";

function Timeline({ detail }: { detail: Extract<AreaDetail, { layout: "timeline" }> }) {
  const lastIndex = detail.items.length - 1;

  return (
    <ol className="relative">
      {detail.items.map((item, index) => (
        <li key={item.id} className="relative pl-8 pb-10 last:pb-0 md:pb-12">
          {index < lastIndex && (
            <span
              aria-hidden
              className="absolute left-[2.5px] top-[5px] bottom-[-5px] w-px bg-gold/25"
            />
          )}
          <span aria-hidden className="absolute left-0 top-[5px] h-1.5 w-1.5 rounded-full bg-gold" />
          <p className={NUMBER_CLASS}>{String(index + 1).padStart(2, "0")}</p>
          <h4 className="mt-3 font-display text-[clamp(26px,2vw,34px)] leading-[1.1] tracking-[-0.02em] text-ivory md:mt-4">
            {item.title}
          </h4>
          {item.meta && (
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-gold">
              {item.meta}
            </p>
          )}
          <p className="mt-2 max-w-[620px] text-[clamp(16px,1.1vw,19px)] leading-[1.5] text-ivory/70">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}

function List({ detail }: { detail: Extract<AreaDetail, { layout: "list" }> }) {
  return (
    <div>
      {detail.meta && (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {detail.meta}
        </p>
      )}
      {detail.summary && (
        <p className="mb-10 max-w-[620px] text-[clamp(17px,1.15vw,20px)] leading-[1.6] text-ivory/70">
          {detail.summary}
        </p>
      )}
      <ol>
        {detail.items.map((item, index) => (
          <li
            key={item.id}
            className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 border-b border-ivory/10 py-6 last:border-b-0 md:py-7"
          >
            <p className={`mt-1.5 ${NUMBER_CLASS}`}>{String(index + 1).padStart(2, "0")}</p>
            <div>
              <h4 className="font-display text-[clamp(22px,1.8vw,30px)] leading-[1.15] tracking-[-0.02em] text-ivory text-balance">
                {item.title}
              </h4>
              {item.summary && (
                <p className="mt-2 max-w-[620px] text-[clamp(16px,1.1vw,19px)] leading-[1.55] text-ivory/65">
                  {item.summary}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Dense({ detail }: { detail: Extract<AreaDetail, { layout: "dense" }> }) {
  return (
    <div>
      {detail.summary && (
        <p className="mb-10 max-w-[620px] text-[clamp(17px,1.15vw,20px)] leading-[1.6] text-ivory/70">
          {detail.summary}
        </p>
      )}
      <div className="mb-10 flex items-baseline gap-4">
        <span className="font-display text-[clamp(38px,9vw,52px)] leading-[0.85] text-ivory md:text-[clamp(48px,4.5vw,72px)]">
          {detail.items.length}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {detail.countLabel}
        </span>
      </div>
      <DenseListIndex items={detail.items} />
    </div>
  );
}

export function AreaDetailPanel({ detail }: { detail: AreaDetail }) {
  switch (detail.layout) {
    case "timeline":
      return <Timeline detail={detail} />;
    case "list":
      return <List detail={detail} />;
    case "dense":
      return <Dense detail={detail} />;
  }
}
