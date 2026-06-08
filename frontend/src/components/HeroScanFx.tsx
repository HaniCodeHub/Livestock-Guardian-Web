import { useRef, useState } from "react";
import scan1 from "@/assets/hero-scan-1.png";
import scan2 from "@/assets/hero-scan-2.png";
import { ChevronLeft, ChevronRight, Activity, ScanLine } from "lucide-react";

const SLIDES = [
  { src: scan1, label: "Muzzle lock + profile" },
  { src: scan2, label: "Biometric mesh capture" },
];

/** Swipeable AI-scan hero card with 3D parallax tilt. */
export function HeroScanFx() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [idx, setIdx] = useState(0);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  const go = (dir: 1 | -1) => setIdx((i) => (i + dir + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[idx];

  return (
    <div
      ref={ref}
      className="relative [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gold opacity-30 blur-3xl animate-pulse" />

      <div
        className="group relative overflow-hidden rounded-3xl border shadow-elegant transition-all duration-500 ease-out will-change-transform float-y hover:shadow-2xl"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Slide */}
        <div className="relative aspect-[3/2] overflow-hidden">
          {SLIDES.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.label}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] ${i === idx ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          {/* subtle scan beam for life */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="hero-scan-beam absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
          </div>
        </div>

        {/* Telemetry chips */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          AI vision active
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur">
          <Activity className="h-3 w-3 text-primary" /> 1.2s/frame
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-foreground/85 px-3 py-1.5 text-xs font-medium text-background shadow-soft">
          <ScanLine className="h-3 w-3" /> {slide.label}
        </div>

        {/* Arrow controls */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 -translate-x-2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:bg-background group-hover:translate-x-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 translate-x-2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:bg-background group-hover:translate-x-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-background/70 hover:bg-background"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
