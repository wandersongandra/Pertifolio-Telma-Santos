"use client";

import { useEffect, useRef } from "react";

interface ScratchCanvasProps {
  src: string;
  interactive: boolean;
  onScratchStart: () => void;
  onCoverageChange: (coverage: number) => void;
  className?: string;
}

const CELL_SIZE = 20;
const BRUSH_RADIUS = 60;
const MAX_DPR = 2;

export function ScratchCanvas({
  src,
  interactive,
  onScratchStart,
  onCoverageChange,
  className,
}: ScratchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageReadyRef = useRef(false);

  const rafIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const isDraggingRef = useRef(false);
  const queueRef = useRef<{ x: number; y: number }[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const gridRef = useRef<Uint8Array | null>(null);
  const gridColsRef = useRef(0);
  const gridRowsRef = useRef(0);
  const erasedCellsRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const onScratchStartRef = useRef(onScratchStart);
  const onCoverageChangeRef = useRef(onCoverageChange);

  useEffect(() => {
    onScratchStartRef.current = onScratchStart;
    onCoverageChangeRef.current = onCoverageChange;
  });

  const drawBaseImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !imageReadyRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    const containerRatio = width / height;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    let drawWidth: number;
    let drawHeight: number;

    if (imageRatio > containerRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
    }

    const offsetX = (width - drawWidth) / 2;
    const offsetY = height - drawHeight;

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  };

  const setupGrid = (width: number, height: number) => {
    const cols = Math.max(1, Math.ceil(width / CELL_SIZE));
    const rows = Math.max(1, Math.ceil(height / CELL_SIZE));
    gridColsRef.current = cols;
    gridRowsRef.current = rows;
    gridRef.current = new Uint8Array(cols * rows);
    erasedCellsRef.current = 0;
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sizeRef.current = { width: rect.width, height: rect.height, dpr };
    setupGrid(rect.width, rect.height);
    drawBaseImage();
  };

  const markCells = (x: number, y: number, radius: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const cols = gridColsRef.current;
    const rows = gridRowsRef.current;

    const minCol = Math.max(0, Math.floor((x - radius) / CELL_SIZE));
    const maxCol = Math.min(cols - 1, Math.floor((x + radius) / CELL_SIZE));
    const minRow = Math.max(0, Math.floor((y - radius) / CELL_SIZE));
    const maxRow = Math.min(rows - 1, Math.floor((y + radius) / CELL_SIZE));

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const cx = col * CELL_SIZE + CELL_SIZE / 2;
        const cy = row * CELL_SIZE + CELL_SIZE / 2;
        const dx = cx - x;
        const dy = cy - y;
        if (dx * dx + dy * dy <= radius * radius) {
          const index = row * cols + col;
          if (grid[index] === 0) {
            grid[index] = 1;
            erasedCellsRef.current += 1;
          }
        }
      }
    }
  };

  const paintAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.9)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    markCells(x, y, BRUSH_RADIUS * 0.75);
  };

  const paintSegment = (from: { x: number; y: number } | null, to: { x: number; y: number }) => {
    if (!from) {
      paintAt(to.x, to.y);
      return;
    }
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(distance / 6));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      paintAt(from.x + dx * t, from.y + dy * t);
    }
  };

  useEffect(() => {
    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      imageReadyRef.current = true;
      resizeCanvas();
    };
    imageRef.current = image;

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (containerRef.current) intersectionObserver.observe(containerRef.current);

    const loop = () => {
      rafIdRef.current = requestAnimationFrame(loop);
      if (!isVisibleRef.current) return;
      const queue = queueRef.current;
      if (queue.length === 0) return;

      queueRef.current = [];
      for (const point of queue) {
        paintSegment(lastPointRef.current, point);
        lastPointRef.current = point;
      }

      const grid = gridRef.current;
      if (grid) {
        const coverage = erasedCellsRef.current / grid.length;
        onCoverageChangeRef.current(coverage);
      }
    };
    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const getRelativePoint = (event: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!interactive) return;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    isDraggingRef.current = true;
    lastPointRef.current = null;
    onScratchStartRef.current();
    queueRef.current.push(getRelativePoint(event));
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!interactive || !isDraggingRef.current) return;
    queueRef.current.push(getRelativePoint(event));
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div ref={containerRef} className={className} style={{ position: "absolute", inset: 0 }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: interactive ? "none" : "default",
          pointerEvents: interactive ? "auto" : "none",
        }}
      />
    </div>
  );
}
