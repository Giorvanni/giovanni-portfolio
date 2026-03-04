"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

/* ================================================================
   HOOKS
   ================================================================ */

// ─── Intersection Observer ─────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Active section tracker for nav ────────────────────────────────
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [ids]);
  return active;
}

// ─── Cursor spotlight (global) ─────────────────────────────────────
function useCursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.opacity = "1";
      });
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

// ─── Magnetic cursor effect ────────────────────────────────────────
function useMagnetic() {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  }, []);
  return { ref, onMove, onLeave };
}

// ─── Mouse parallax for hero background ────────────────────────────
function useParallax() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.transform = `translate(${cx * 30}px, ${cy * 20}px)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

// ─── Card spotlight (per-card mouse glow) ──────────────────────────
function useCardSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const spotlight = el.querySelector(".card-spotlight") as HTMLElement;
    if (spotlight) {
      spotlight.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(110,231,183,0.06), transparent 60%)`;
    }
  }, []);
  return { ref, onMove };
}

// ─── Scroll progress bar ───────────────────────────────────────────
function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement;
      const progress = h.scrollTop / (h.scrollHeight - h.clientHeight);
      el.style.transform = `scaleX(${Math.min(progress, 1)})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

// ─── 3D tilt effect ────────────────────────────────────────────────
function useTilt(intensity = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02,1.02,1.02)`;
      });
    },
    [intensity]
  );
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el)
      el.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);
  return { ref, onMove, onLeave };
}

// ─── Custom cursor (dot + ring with spring) ───────────────────────
function useCustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("custom-cursor-active");

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const leave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(
        "a, button, [role=button], input, textarea, select"
      );
      const h = !!t;
      dot.classList.toggle("hover", h);
      ring.classList.toggle("hover", h);
    };

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return { dotRef, ringRef };
}

/* ================================================================
   INTERACTIVE COMPONENTS
   ================================================================ */

// ─── Canvas particle constellation ─────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let id = 0;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = 60;
    const CONN = 130;
    const MR = 180;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const pts: P[] = [];

    const resize = () => {
      const w = c.offsetWidth;
      const h = c.offsetHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const W = () => c.offsetWidth;
    const H = () => c.offsetHeight;

    for (let i = 0; i < N; i++) {
      pts.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.2 + 0.4,
      });
    }

    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MR && d > 0) {
          const f = ((MR - d) / MR) * 0.015;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(110,231,183,0.25)";
        ctx.fill();
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(110,231,183,${(1 - d / CONN) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MR) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(110,231,183,${(1 - d / MR) * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      id = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(id);
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ─── Text scramble decode effect ───────────────────────────────────
function TextScramble({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const triggered = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !triggered.current) {
          triggered.current = true;
          const chars = "!<>-_\\/[]{}=+*^?#";
          let frame = 0;
          const total = 25;
          const step = () => {
            if (!alive.current) return;
            const progress = frame / total;
            const resolved = Math.floor(progress * text.length);
            let out = "";
            for (let i = 0; i < text.length; i++) {
              if (text[i] === " ") out += " ";
              else if (i < resolved) out += text[i];
              else out += chars[Math.floor(Math.random() * chars.length)];
            }
            setDisplay(out);
            frame++;
            if (frame <= total) requestAnimationFrame(step);
            else setDisplay(text);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={`text-scramble ${className}`}>
      {display}
    </span>
  );
}

// ─── Section divider ───────────────────────────────────────────────
function SectionDivider() {
  return <div className="section-divider mx-5 sm:mx-8" />;
}

// ─── Floating code editor window ───────────────────────────────────
function CodeWindow() {
  const lines: { code: ReactNode }[] = [
    {
      code: (
        <>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-white">giovanni</span>{" "}
          <span className="text-zinc-600">=</span>{" "}
          <span className="text-zinc-500">{"{"}</span>
        </>
      ),
    },
    {
      code: (
        <>
          {"  "}
          <span className="text-zinc-400">role</span>
          <span className="text-zinc-600">:</span>{" "}
          <span className="text-green-300">
            &quot;Full Stack Engineer&quot;
          </span>
          <span className="text-zinc-600">,</span>
        </>
      ),
    },
    {
      code: (
        <>
          {"  "}
          <span className="text-zinc-400">company</span>
          <span className="text-zinc-600">:</span>{" "}
          <span className="text-green-300">&quot;BTV&quot;</span>
          <span className="text-zinc-600">,</span>
        </>
      ),
    },
    {
      code: (
        <>
          {"  "}
          <span className="text-zinc-400">stack</span>
          <span className="text-zinc-600">:</span>{" "}
          <span className="text-zinc-600">[</span>
          <span className="text-amber-300">&quot;Next.js&quot;</span>
          <span className="text-zinc-600">,</span>{" "}
          <span className="text-amber-300">&quot;TS&quot;</span>
          <span className="text-zinc-600">,</span>{" "}
          <span className="text-amber-300">&quot;Prisma&quot;</span>
          <span className="text-zinc-600">],</span>
        </>
      ),
    },
    {
      code: (
        <>
          {"  "}
          <span className="text-zinc-400">focus</span>
          <span className="text-zinc-600">:</span>{" "}
          <span className="text-green-300">
            &quot;production SaaS&quot;
          </span>
          <span className="text-zinc-600">,</span>
        </>
      ),
    },
    {
      code: (
        <>
          {"  "}
          <span className="text-zinc-400">status</span>
          <span className="text-zinc-600">:</span>{" "}
          <span className="text-green-300">
            &quot;open_to_work&quot;
          </span>
          <span className="text-zinc-600">,</span>
        </>
      ),
    },
    {
      code: <span className="text-zinc-500">{"};"}</span>,
    },
  ];

  return (
    <div className="code-window w-80">
      <div className="code-window-bar">
        <div className="code-window-dot" style={{ background: "#ff5f57" }} />
        <div className="code-window-dot" style={{ background: "#febc2e" }} />
        <div className="code-window-dot" style={{ background: "#28c840" }} />
        <span className="ml-3 font-mono text-[11px] text-zinc-600">
          giovanni.ts
        </span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-[1.9]">
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              opacity: 0,
              animation: `fade-up 0.4s ${2.2 + i * 0.12}s forwards`,
            }}
          >
            <span className="mr-3 inline-block w-4 select-none text-right text-zinc-700">
              {i + 1}
            </span>
            {l.code}
          </div>
        ))}
        <div
          style={{
            opacity: 0,
            animation: `fade-up 0.4s ${2.2 + lines.length * 0.12}s forwards`,
          }}
        >
          <span className="mr-3 inline-block w-4 select-none text-right text-zinc-700">
            {lines.length + 1}
          </span>
          <span className="typewriter-caret" />
        </div>
      </div>
    </div>
  );
}

// ─── 3D orbit rings visualization ──────────────────────────────────
function OrbitRings() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden"
      style={{ perspective: "800px" }}
    >
      <div className="orbit-system relative">
        {/* Ring 1 */}
        <div
          className="orbit-ring"
          style={{
            width: "350px",
            height: "350px",
            marginLeft: "-175px",
            marginTop: "-175px",
            borderWidth: "1px",
            borderColor: "rgba(110,231,183,0.07)",
            animation: "orbit 20s linear infinite",
          }}
        >
          <div
            className="orbit-dot"
            style={{
              width: "6px",
              height: "6px",
              background: "#6ee7b7",
              opacity: 0.5,
              boxShadow: "0 0 10px 2px rgba(110,231,183,0.4)",
            }}
          />
        </div>
        {/* Ring 2 */}
        <div
          className="orbit-ring"
          style={{
            width: "550px",
            height: "550px",
            marginLeft: "-275px",
            marginTop: "-275px",
            borderWidth: "1px",
            borderColor: "rgba(167,139,250,0.04)",
            animation: "orbit-reverse 32s linear infinite",
          }}
        >
          <div
            className="orbit-dot"
            style={{
              width: "8px",
              height: "8px",
              background: "#a78bfa",
              opacity: 0.35,
              boxShadow: "0 0 14px 3px rgba(167,139,250,0.25)",
            }}
          />
        </div>
        {/* Ring 3 */}
        <div
          className="orbit-ring"
          style={{
            width: "750px",
            height: "750px",
            marginLeft: "-375px",
            marginTop: "-375px",
            borderWidth: "1px",
            borderColor: "rgba(56,189,248,0.025)",
            animation: "orbit 45s linear infinite",
          }}
        >
          <div
            className="orbit-dot"
            style={{
              width: "5px",
              height: "5px",
              background: "#38bdf8",
              opacity: 0.25,
              boxShadow: "0 0 8px 2px rgba(56,189,248,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Dot grid background canvas ────────────────────────────────────
function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let id = 0;
    const mouse = { x: -9999, y: -9999 };
    const GAP = 28;
    const BASE_R = 0.6;
    const GLOW_R = 200;

    const resize = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = `${window.innerWidth}px`;
      c.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const scrollY = window.scrollY;
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      const offsetY = -(scrollY % GAP);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * GAP;
          const y = row * GAP + offsetY;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let r = BASE_R;
          let alpha = 0.08;

          if (dist < GLOW_R) {
            const t = 1 - dist / GLOW_R;
            r = BASE_R + t * 1.8;
            alpha = 0.08 + t * 0.35;
          }

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(110, 231, 183, ${alpha})`;
          ctx.fill();
        }
      }

      id = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", () => {}, { passive: true });

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-grid-canvas" />;
}

// ─── Glitch text wrapper ───────────────────────────────────────────
function GlitchText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`glitch-wrapper ${className}`}>
      {children}
      <span className="glitch-layer" aria-hidden="true">
        {children}
      </span>
      <span className="glitch-layer" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

// ─── Floating tech icons in hero ───────────────────────────────────
function FloatingIcons() {
  const icons = [
    { label: "TS", x: "8%", y: "18%", delay: "0s", dur: "7s", color: "#3178c6" },
    { label: "{}",  x: "85%", y: "22%", delay: "1s", dur: "8s", color: "#6ee7b7" },
    { label: "</>", x: "12%", y: "72%", delay: "2s", dur: "6s", color: "#a78bfa" },
    { label: "()=>", x: "78%", y: "68%", delay: "0.5s", dur: "9s", color: "#fbbf24" },
    { label: "git", x: "92%", y: "45%", delay: "1.5s", dur: "7.5s", color: "#f97316" },
    { label: "sql", x: "5%", y: "48%", delay: "3s", dur: "8.5s", color: "#38bdf8" },
    { label: "API", x: "70%", y: "12%", delay: "2.5s", dur: "6.5s", color: "#f472b6" },
    { label: "fn", x: "25%", y: "82%", delay: "0.8s", dur: "7.2s", color: "#34d399" },
  ];

  return (
    <>
      {icons.map((ic, i) => (
        <span
          key={i}
          className="floating-icon font-mono font-bold"
          style={{
            left: ic.x,
            top: ic.y,
            animationDelay: ic.delay,
            animationDuration: ic.dur,
            color: ic.color,
            opacity: 0.08,
          }}
        >
          {ic.label}
        </span>
      ))}
    </>
  );
}

// ─── Metrics banner ────────────────────────────────────────────────
function MetricsBanner() {
  const { ref, visible } = useReveal(0.2);
  const metrics = [
    { value: 52, suffix: "+", label: "API Routes Built" },
    { value: 24, suffix: "+", label: "Database Models" },
    { value: 6, suffix: "", label: "Integrations Shipped" },
    { value: 3, suffix: "", label: "Products Delivered" },
  ];

  return (
    <div
      ref={ref}
      className={`reveal-ready ${visible ? "reveal-visible" : ""} relative overflow-hidden border-y border-white/[0.03] bg-[#0a0a0a] py-16 sm:py-20`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-accent/[0.02] to-transparent" />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-8">
        {metrics.map((m, i) => (
          <div key={i} className="metric-item text-center">
            <div
              className="font-mono text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(100%)",
                transition: `opacity 0.6s ${0.1 + i * 0.12}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.12}s`,
              }}
            >
              {visible ? <CountUp value={m.value} suffix={m.suffix} /> : "0"}
            </div>
            <div
              className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 sm:text-[11px]"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s ${0.3 + i * 0.12}s`,
              }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Side nav dots ─────────────────────────────────────────────────
function SideNav({ active }: { active: string }) {
  const items = [
    { id: "about", label: "about" },
    { id: "approach", label: "approach" },
    { id: "experience", label: "experience" },
    { id: "projects", label: "projects" },
    { id: "systems", label: "systems" },
    { id: "skills", label: "skills" },
    { id: "contact", label: "contact" },
  ];

  return (
    <nav className="side-nav hidden lg:flex" aria-label="Section navigation">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-label={item.label}
          className={`side-dot ${active === item.id ? "active" : ""}`}
          aria-label={item.label}
        />
      ))}
    </nav>
  );
}

// ─── Terminal command strip ────────────────────────────────────────
function TerminalStrip() {
  const items = [
    "building multi-tenant SaaS from scratch",
    "designing production data architectures",
    "shipping autonomous intelligence systems",
    "engineering systems that compound",
    "scaling platforms across business units",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="terminal-strip">
      <div className="marquee-track" style={{ animationDuration: "22s" }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[11px] text-zinc-600"
          >
            <span className="text-accent">$</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SMALL COMPONENTS
   ================================================================ */

function Section({
  children,
  className = "",
  id,
  watermark,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  watermark?: string;
}) {
  const { ref, visible } = useReveal(0.08);
  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-ready ${visible ? "reveal-visible" : ""} relative overflow-hidden ${className}`}
    >
      {watermark && (
        <span
          className="section-watermark"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1.5s ease 0.3s",
          }}
        >
          {watermark}
        </span>
      )}
      {children}
    </section>
  );
}

// ─── Animated counter ──────────────────────────────────────────────
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  );
}

// ─── Animated hero letters ─────────────────────────────────────────
function SplitText({
  text,
  className = "",
  baseDelay = 0,
  loaded,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  loaded: boolean;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-letter"
          style={{
            animationDelay: loaded ? `${baseDelay + i * 0.04}s` : "0s",
            animationPlayState: loaded ? "running" : "paused",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// ─── Typewriter effect ─────────────────────────────────────────────
function Typewriter({
  text,
  startDelay = 1.2,
}: {
  text: string;
  startDelay?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay * 1000);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <>
      {displayed}
      {started && !done && <span className="typewriter-caret" />}
    </>
  );
}

// ─── Skills marquee ────────────────────────────────────────────────
function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#080808] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#080808] to-transparent" />
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-3 shrink-0 rounded-lg bg-white/[0.03] px-5 py-2.5 text-[13px] text-zinc-500 ring-1 ring-white/[0.06] transition-colors hover:text-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// Spotlight card wrapper with 3D tilt
function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref: spotRef, onMove: spotMove } = useCardSpotlight();
  const { ref: tiltRef, onMove: tiltMove, onLeave: tiltLeave } = useTilt();

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      (spotRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [spotRef, tiltRef]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      spotMove(e);
      tiltMove(e);
    },
    [spotMove, tiltMove]
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={tiltLeave}
      className={`card tilt-card ${className}`}
    >
      <div className="card-spotlight" />
      {children}
    </div>
  );
}

/* ================================================================
   PAGE CURTAIN
   ================================================================ */

function Curtain() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"count" | "ready" | "split" | "done">(
    "count"
  );

  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase("ready"), 950);
    const t2 = setTimeout(() => setPhase("split"), 1500);
    const t3 = setTimeout(() => setPhase("done"), 2300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  const splitting = phase === "split";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        pointerEvents: splitting ? "none" : "auto",
      }}
    >
      {/* Top panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#080808",
          transform: splitting ? "translateY(-105%)" : "none",
          transition: splitting
            ? "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
        }}
      />
      {/* Bottom panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#080808",
          transform: splitting ? "translateY(105%)" : "none",
          transition: splitting
            ? "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
        }}
      />
      {/* Accent line at split */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #6ee7b7, transparent)",
          transform: "translateY(-0.5px)",
          opacity: splitting ? 0 : phase === "ready" ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      {/* Counter + terminal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: splitting ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "clamp(3rem, 10vw, 7rem)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            color: "white",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(count).padStart(3, "0")}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "12px",
            color: "#6ee7b7",
            marginTop: "20px",
            height: "20px",
            opacity: phase === "ready" || splitting ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          {(phase === "ready" || splitting) && (
            <>
              {">"} giovanni.init()
              <span className="typewriter-caret" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   NAV
   ================================================================ */

const sectionIds = [
  "about",
  "approach",
  "experience",
  "projects",
  "systems",
  "skills",
  "contact",
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const progressRef = useScrollProgress();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "#about", label: "About", id: "about" },
    { href: "#approach", label: "Approach", id: "approach" },
    { href: "#experience", label: "Experience", id: "experience" },
    { href: "#projects", label: "Projects", id: "projects" },
    { href: "#skills", label: "Skills", id: "skills" },
    { href: "#contact", label: "Contact", id: "contact" },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || open ? "rgba(8,8,8,0.82)" : "transparent",
        backdropFilter:
          scrolled || open ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter:
          scrolled || open ? "blur(16px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.05)"
          : "1px solid transparent",
      }}
    >
      <div ref={progressRef} className="scroll-progress" />
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="text-lg font-bold tracking-tight text-white">
          giovanni<span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3.5 py-1.5 text-[13px] text-zinc-500 transition-colors hover:text-white ${active === l.id ? "nav-link-active" : ""}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 rounded-lg bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-accent"
          >
            Contact
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className="block h-[1.5px] w-5 bg-zinc-400 transition-all duration-300"
            style={{
              transform: open ? "translateY(3px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-[1.5px] w-5 bg-zinc-400 transition-all duration-300"
            style={{
              transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      <div
        className="overflow-hidden transition-all duration-300 md:hidden"
        style={{ maxHeight: open ? "100vh" : "0px" }}
      >
        <div className="flex flex-col gap-1 border-t border-white/5 px-5 pb-6 pt-4 sm:px-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-3 text-[15px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white ${active === l.id ? "nav-link-active" : ""}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-[15px] font-semibold text-black"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   HERO
   ================================================================ */

function Hero() {
  const mag = useMagnetic();
  const parallax = useParallax();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 sm:px-8">
      {/* Parallax background glows */}
      <div ref={parallax} className="pointer-events-none absolute inset-0" style={{ transition: "transform 0.15s ease-out" }}>
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(900px, 90vw)",
            height: "min(600px, 60vw)",
            background:
              "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/4"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-0 top-2/3 -translate-x-1/4"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Interactive particle constellation */}
      <ParticleField />

      {/* Floating tech icons */}
      <FloatingIcons />

      {/* 3D orbit rings */}
      <OrbitRings />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Status badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(12px)",
            transition: "opacity 0.6s 0.15s, transform 0.6s 0.15s",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium tracking-wider text-accent">
            OPEN TO WORK
          </span>
        </div>

        {/* Name with split letter animation */}
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.95] tracking-tighter text-white" style={{ perspective: "600px" }}>
          <GlitchText>
            <SplitText text="Giovanni" loaded={loaded} baseDelay={0.3} />
          </GlitchText>
          <br />
          <GlitchText className="shimmer-text">
            <SplitText text="Bagmeijer" loaded={loaded} baseDelay={0.6} />
          </GlitchText>
        </h1>

        {/* Role */}
        <p
          className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500 sm:text-base"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(12px)",
            transition: "opacity 0.6s 1.1s, transform 0.6s 1.1s",
          }}
        >
          <Typewriter text="Systems-Oriented Full Stack Engineer" startDelay={1.6} />
        </p>

        {/* Description */}
        <p
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(12px)",
            transition: "opacity 0.6s 1.3s, transform 0.6s 1.3s",
          }}
        >
          Designing scalable SaaS platforms, data architectures, and autonomous
          systems. Turning strategic intent into production-ready software,
          built to last.
        </p>

        {/* CTA */}
        <div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(12px)",
            transition: "opacity 0.6s 1.5s, transform 0.6s 1.5s",
          }}
        >
          <a
            ref={mag.ref}
            onMouseMove={mag.onMove}
            onMouseLeave={mag.onLeave}
            href="#projects"
            className="w-full rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-black hover:bg-accent hover:shadow-[0_0_32px_-4px_rgba(110,231,183,0.35)] sm:w-auto"
            style={{
              transition:
                "background 0.2s, box-shadow 0.3s, transform 0.15s ease-out",
            }}
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="outline-glow w-full rounded-xl border border-white/10 px-8 py-3.5 text-[15px] font-medium text-zinc-300 transition-all hover:border-transparent hover:text-white sm:w-auto"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Floating code window — desktop only */}
      <div
        className="absolute bottom-20 right-8 z-10 hidden lg:block xl:right-[calc(50vw-520px)]"
        style={{ perspective: "800px" }}
      >
        <div
          style={{
            transform: "rotateY(-8deg) rotateX(4deg)",
            opacity: 0,
            animation: "fade-up 0.8s 1.9s forwards",
          }}
        >
          <CodeWindow />
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s 1.8s",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   ABOUT
   ================================================================ */

function About() {
  return (
    <Section
      id="about"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
      watermark="About"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          About
        </span>
      </div>

      <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        <TextScramble text="Engineering with leverage" />
      </h2>

      <div className="mt-12 max-w-2xl space-y-5 text-[15px] leading-[1.8] text-zinc-400">
        <p>
          I&apos;m a Full Stack Engineer at{" "}
          <span className="font-medium text-white">
            Bright Technology Ventures
          </span>
          , where I serve as a technical sparring partner for management and
          commercial teams. I translate business strategy into scalable,
          production-grade systems across multiple business units.
        </p>
        <p>
          I specialize in designing software that reduces long-term development
          friction. Generator-driven architectures, structured data models, and
          systems that improve through iteration rather than decay.
        </p>
        <p>
          Before moving into engineering, I spent four years as a{" "}
          <span className="font-medium text-white">
            Communication Specialist
          </span>{" "}
          at a real estate tech startup, helping scale it from early-stage to
          scale-up. That background shapes how I build: I don&apos;t just ship
          features. I build systems that create measurable business value.
        </p>
      </div>
    </Section>
  );
}

/* ================================================================
   ENGINEERING APPROACH
   ================================================================ */

const approachItems = [
  { label: "Design once, reuse at scale", sub: "Generator-driven development" },
  { label: "Data structure over surface features", sub: "Schema-first thinking" },
  { label: "Architecture for long-term maintainability", sub: "Reduce future cost" },
  { label: "Automate marginal development cost", sub: "Compounding efficiency" },
  { label: "Production constraints from day one", sub: "Ship real software" },
  { label: "Software as infrastructure", sub: "Not experiments" },
];

function Approach() {
  return (
    <Section
      id="approach"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Engineering Approach
        </span>
      </div>

      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        <TextScramble text="How I build" />
      </h2>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {approachItems.map((item, i) => (
          <SpotlightCard key={i} className="flex flex-col gap-2 p-5">
            <div className="relative z-10">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-accent/[0.08] font-mono text-xs font-bold text-accent">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-[14px] font-semibold text-white">
                {item.label}
              </h3>
              <p className="mt-1 text-[12px] text-zinc-600">{item.sub}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================
   EXPERIENCE
   ================================================================ */

const jobs = [
  {
    period: "Jun 2024 \u2013 Present",
    role: "Full Stack Web Developer",
    company: "Bright Technology Ventures",
    current: true,
    text: "Technical sparring partner for management and commercial teams. Designing, building, and maintaining digital platforms and internal intelligence systems across multiple business units.",
    tags: [
      "Multi-tenant SaaS",
      "Data Modeling",
      "Market Intelligence",
      "AI Integration",
      "SEO Data Pipelines",
    ],
  },
  {
    period: "Jan \u2013 Jun 2024",
    role: "Technical Marketer",
    company: "Bright Technology Ventures",
    current: false,
    text: "Bridged commercial growth and technical execution. Website performance, data quality, GTM, and HubSpot routing across business units.",
    tags: ["GTM", "HubSpot", "Performance", "Commercial Growth"],
  },
  {
    period: "2019 \u2013 2023",
    role: "Communication Specialist",
    company: "Kode Vastgoed",
    current: false,
    text: "Helped scale the company from startup to scale-up. Led content strategy, stakeholder communication, and multi-channel growth initiatives.",
    tags: ["Content Strategy", "Stakeholders", "Startup Scaling"],
  },
];

function Experience() {
  return (
    <Section
      id="experience"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
      watermark="Work"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Experience
        </span>
      </div>
      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        <TextScramble text="Where I've worked" />
      </h2>

      <div className="mt-14 flex flex-col gap-6">
        {jobs.map((job, i) => (
          <SpotlightCard
            key={i}
            className="group relative overflow-hidden p-6 sm:p-8"
          >
            {job.current && (
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            )}

            <div className="relative z-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-semibold text-white">
                      {job.role}
                    </h3>
                    {job.current && (
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent ring-1 ring-accent/20">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{job.company}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-zinc-600 sm:text-sm">
                  {job.period}
                </span>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-zinc-500 sm:text-sm">
                {job.text}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-500 ring-1 ring-white/[0.06]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================
   PROJECTS
   ================================================================ */

const projects = [
  {
    title: "Beyond Bricks",
    sub: "Service Cost Management SaaS Platform",
    text: "Designed and built a complete SaaS platform for digitally managing and settling service costs in the rental sector. Architecture, backend, frontend, security, payments, hosting. All from scratch.",
    stats: [
      { value: 52, label: "API Routes" },
      { value: 24, label: "DB Models" },
      { value: 6, label: "Integrations" },
    ],
    architecture: [
      "RBAC system",
      "Mollie payments + secure webhooks",
      "Rate limiting & CSRF protection",
      "PDF generation + email automation",
      "Admin monitoring dashboard",
      "Multi-tenant data isolation",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "Tailwind",
      "Vercel",
      "Mollie",
    ],
    color: "#6ee7b7",
  },
  {
    title: "Sentinel",
    sub: "Autonomous Market Intelligence System (R&D)",
    text: "A research-driven platform for automated competitive and market analysis. Designed to ingest signals, classify strategic movement, and surface actionable intelligence.",
    stats: [
      { value: 4, label: "Pipelines" },
      { value: 3, label: "LLM Models" },
      { value: 1, label: "Prototype", suffix: "" },
    ],
    architecture: [
      "Async pipeline processing",
      "Signal classification & scoring",
      "LLM-powered semantic analysis",
      "Serverless task orchestration",
    ],
    tech: ["Python", "Docker", "AWS SQS", "LLM APIs", "PostgreSQL"],
    color: "#a78bfa",
  },
];

function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      const scrollable = sectionH - viewH;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const maxTranslate = track.scrollWidth - window.innerWidth;
      track.style.transform = `translateX(${-progress * maxTranslate}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="horizontal-scroll-section relative"
      style={{ height: `${100 + projects.length * 80}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 pb-6 sm:px-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-accent/50" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Projects
            </span>
          </div>
          <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            <TextScramble text="Built from scratch" />
          </h2>
        </div>

        <div
          ref={trackRef}
          className="horizontal-scroll-inner will-change-transform"
          style={{ paddingLeft: "max(2rem, calc(50vw - 30rem))" }}
        >
          {projects.map((p, i) => {
            const cs = useCardSpotlight();
            return (
              <div
                key={i}
                ref={cs.ref}
                onMouseMove={cs.onMove}
                className="card group relative overflow-hidden"
                style={{ width: "min(85vw, 640px)" }}
              >
                <div className="card-spotlight" />
                <div
                  className="h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${p.color}, transparent 80%)`,
                  }}
                />

                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: p.color }}
                />

                <div className="relative z-10 p-6 sm:p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{p.sub}</p>
                  </div>

                  <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-zinc-500">
                    {p.text}
                  </p>

                  {/* Animated stats */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {p.stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl bg-white/[0.03] p-3 text-center ring-1 ring-white/[0.04]"
                      >
                        <div className="text-xl font-black text-white">
                          {"suffix" in s && s.suffix === "" ? (
                            s.value
                          ) : (
                            <CountUp
                              value={s.value}
                              suffix={
                                ("suffix" in s ? s.suffix : undefined) ?? "+"
                              }
                            />
                          )}
                        </div>
                        <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Architecture */}
                  <div className="mt-6">
                    <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Architecture
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {p.architecture.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 text-[13px] text-zinc-400"
                        >
                          <svg
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: p.color }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stack */}
                  <div className="mt-6">
                    <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] text-zinc-500 ring-1 ring-white/[0.05] transition-colors hover:text-white"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   ARCHITECTURE & SYSTEMS
   ================================================================ */

const systemItems = [
  "Multi-tenant SaaS architecture",
  "Role-based access control modeling",
  "Event-driven & async systems",
  "Data-first relational modeling",
  "Generator-based scaffolding",
  "Secure webhook design (HMAC verification)",
  "Production deployment pipelines",
  "Observability & system health monitoring",
];

function Systems() {
  return (
    <Section
      id="systems"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Architecture & Systems
        </span>
      </div>

      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        <TextScramble text="What I work with" />
      </h2>

      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        {systemItems.map((item) => (
          <SpotlightCard key={item} className="flex items-start gap-3.5 p-5">
            <div className="relative z-10 flex items-start gap-3.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              <span className="text-[14px] leading-relaxed text-zinc-400">
                {item}
              </span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}

/* ================================================================
   SKILLS (Marquee)
   ================================================================ */

const allSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "HTML/CSS",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Prisma",
  "REST APIs",
  "Redis",
  "Vercel",
  "AWS",
  "Docker",
  "Git",
  "LLM Integration",
  "SQL Architecture",
  "Market Intelligence",
  "Automation",
];

function Skills() {
  const half = Math.ceil(allSkills.length / 2);
  const row1 = allSkills.slice(0, half);
  const row2 = allSkills.slice(half);

  return (
    <Section
      id="skills"
      className="py-24 sm:py-32 lg:py-40"
      watermark="Stack"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-accent/50" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Skills
          </span>
        </div>
        <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          <TextScramble text="My toolkit" />
        </h2>
      </div>

      <div className="mt-14 flex flex-col gap-4">
        <Marquee items={row1} />
        <div style={{ direction: "rtl" }}>
          <Marquee items={row2} />
        </div>
      </div>
    </Section>
  );
}

/* ================================================================
   CONTACT
   ================================================================ */

function Contact() {
  return (
    <Section
      id="contact"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-accent/50" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Contact
          </span>
          <div className="h-px w-8 bg-accent/50" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          <TextScramble text="Let's talk" />
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-zinc-500 sm:text-base">
          Interested in collaborating or building something ambitious?
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <SpotlightCard className="group flex items-center gap-4 p-5 text-left">
            <a
              href="mailto:g.bagmeijer@gmail.com"
              className="relative z-10 flex w-full items-center gap-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/[0.08] text-accent transition-colors group-hover:bg-accent/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                  Email
                </div>
                <div className="mt-0.5 truncate text-sm text-zinc-400 transition-colors group-hover:text-accent">
                  g.bagmeijer@gmail.com
                </div>
              </div>
            </a>
          </SpotlightCard>
          <SpotlightCard className="group flex items-center gap-4 p-5 text-left">
            <a
              href="tel:+31645073445"
              className="relative z-10 flex w-full items-center gap-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/[0.08] text-accent transition-colors group-hover:bg-accent/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                  Phone
                </div>
                <div className="mt-0.5 text-sm text-zinc-400 transition-colors group-hover:text-accent">
                  06-45073445
                </div>
              </div>
            </a>
          </SpotlightCard>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Nijmegen, The Netherlands
        </div>
      </div>
    </Section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="text-xs text-zinc-700">
          &copy; {new Date().getFullYear()} Giovanni Bagmeijer
        </span>
        <span className="text-xs text-zinc-800">
          Built with Next.js &middot; Tailwind &middot; Vercel
        </span>
      </div>
    </footer>
  );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function Home() {
  const spotlightRef = useCursorSpotlight();
  const { dotRef, ringRef } = useCustomCursor();
  const active = useActiveSection(sectionIds);

  return (
    <div className="noise">
      <Curtain />
      <DotGrid />
      <div ref={spotlightRef} className="cursor-spotlight" />
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <Nav />
      <SideNav active={active} />
      <Hero />
      <TerminalStrip />
      <MetricsBanner />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Approach />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Systems />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Contact />
      <Footer />
    </div>
  );
}
