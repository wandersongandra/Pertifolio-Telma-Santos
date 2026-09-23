"use client";

import { Fragment, useMemo, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { siteData } from "@/content/site-data";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Kicker } from "@/components/ui/Kicker";
import { LineReveal, HighlightWord } from "@/components/motion/LineReveal";
import {
  tokenize,
  useParagraphLines,
  type Token,
} from "@/components/motion/useParagraphLines";

const PARAGRAPH_CLASSES =
  "font-display text-2xl md:text-3xl leading-[1.3] tracking-[-0.01em] text-ivory text-balance";

const FIRST_RANGE: [number, number] = [0, 0.4];
const SECOND_RANGE: [number, number] = [0.46, 0.92];

function buildSegments(line: Token[]): ReactNode[] {
  const segments: ReactNode[] = [];
  let index = 0;

  while (index < line.length) {
    const token = line[index];
    if (token.highlighted) {
      const group: Token[] = [];
      while (index < line.length && line[index].highlighted) {
        group.push(line[index]);
        index++;
      }
      segments.push(
        <Fragment key={`highlight-${index}`}>
          <HighlightWord>{group.map((word) => word.text).join(" ")}</HighlightWord>
        </Fragment>
      );
    } else {
      segments.push(<Fragment key={`word-${index}`}>{token.text}</Fragment>);
      index++;
    }
    if (index < line.length) segments.push(" ");
  }

  return segments;
}

interface ParagraphBlockProps {
  tokens: Token[];
  lines: Token[][] | null;
  containerRef: React.RefObject<HTMLParagraphElement | HTMLDivElement | null>;
  progress: MotionValue<number>;
  range: [number, number];
}

function ParagraphBlock({
  tokens,
  lines,
  containerRef,
  progress,
  range,
}: ParagraphBlockProps) {
  const fullText = tokens.map((token) => token.text).join(" ");

  if (lines === null) {
    return (
      <div>
        <p className="sr-only">{fullText}</p>
        <p ref={containerRef} aria-hidden="true" className={PARAGRAPH_CLASSES}>
          {tokens.map((token, index) => (
            <Fragment key={index}>
              <span data-word={index} className="inline-block">
                {token.text}
              </span>
              {index < tokens.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </p>
      </div>
    );
  }

  const lineCount = lines.length;
  const span = range[1] - range[0];

  return (
    <div>
      <p className="sr-only">{fullText}</p>
      <div aria-hidden="true" className={PARAGRAPH_CLASSES}>
        {lines.map((line, index) => (
          <LineReveal
            key={index}
            progress={progress}
            start={range[0] + (index / lineCount) * span}
            end={range[0] + ((index + 1) / lineCount) * span}
          >
            {buildSegments(line)}
          </LineReveal>
        ))}
      </div>
    </div>
  );
}

function StaticParagraph({ tokens }: { tokens: Token[] }) {
  return (
    <p className={PARAGRAPH_CLASSES}>
      {tokens.map((token, index) => (
        <Fragment key={index}>
          {token.highlighted ? (
            <span className="text-gold">{token.text}</span>
          ) : (
            token.text
          )}
          {index < tokens.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}

export function Manifesto() {
  const { manifesto } = siteData;
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // As duas pontas são ancoradas na *chegada* da seção, não no fim dela.
    // Amarrar o fim ao "end" (o antigo ["start 0.72", "end 0.45"]) fazia as
    // últimas linhas só aparecerem depois que a seção já tinha passado — e numa
    // viewport mais baixa que a seção esse ponto nunca coincide com elas
    // estarem na tela, então o parágrafo ficava permanentemente cortado.
    // Ancorando no "start", o texto se completa conforme a seção se acomoda,
    // independente da altura da seção e da tela.
    offset: ["start 0.95", "start 0.05"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [18, -14]);

  const tokenized = useMemo(
    () =>
      manifesto.paragraphs.map((paragraph, index) =>
        tokenize(paragraph, manifesto.highlights[index] ?? [])
      ),
    [manifesto]
  );

  const first = useParagraphLines(tokenized[0], !reducedMotion);
  const second = useParagraphLines(tokenized[1], !reducedMotion);

  return (
    <section ref={sectionRef} className="border-y border-warm-gray/20 bg-charcoal/40">
      <div className="mx-auto max-w-4xl shell py-16 md:py-32">
        {reducedMotion ? (
          <Kicker className="mb-6">{manifesto.eyebrow}</Kicker>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <Kicker className="mb-6">{manifesto.eyebrow}</Kicker>
          </motion.div>
        )}

        <motion.div
          style={reducedMotion ? undefined : { y: parallaxY }}
          className="space-y-6"
        >
          {reducedMotion ? (
            <>
              <StaticParagraph tokens={tokenized[0]} />
              <StaticParagraph tokens={tokenized[1]} />
            </>
          ) : (
            <>
              <ParagraphBlock
                tokens={tokenized[0]}
                lines={first.lines}
                containerRef={first.containerRef}
                progress={scrollYProgress}
                range={FIRST_RANGE}
              />
              <ParagraphBlock
                tokens={tokenized[1]}
                lines={second.lines}
                containerRef={second.containerRef}
                progress={scrollYProgress}
                range={SECOND_RANGE}
              />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}