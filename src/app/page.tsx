"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

// ─── Intersection Observer hook ────────────────────────────────────
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

function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useReveal(0.08);
  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-ready ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Magnetic cursor effect on hero CTA ────────────────────────────
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

// ─── Nav ───────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
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
        borderBottom:
          scrolled
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <a href="#" className="text-lg font-bold tracking-tight text-white">
          giovanni<span className="text-accent">.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-1.5 text-[13px] text-zinc-500 transition-colors hover:text-white"
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

        {/* Mobile toggle */}
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

      {/* Mobile menu */}
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
              className="rounded-lg px-3 py-3 text-[15px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
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

// ─── Hero ──────────────────────────────────────────────────────────
function Hero() {
  const mag = useMagnetic();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 sm:px-8">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(900px, 90vw)",
          height: "min(600px, 60vw)",
          background:
            "radial-gradient(ellipse, rgba(110,231,183,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 translate-x-1/3 translate-y-1/4"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto w-full max-w-3xl text-center"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(32px)",
          transition:
            "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Status badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s 0.2s",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium tracking-wider text-accent">
            OPEN TO WORK
          </span>
        </div>

        {/* Name */}
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black leading-[0.95] tracking-tighter text-white">
          Giovanni
          <br />
          <span className="shimmer-text">Bagmeijer</span>
        </h1>

        {/* Role */}
        <p
          className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500 sm:text-base"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s 0.4s",
          }}
        >
          Full Stack Developer
        </p>

        {/* Description */}
        <p
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s 0.55s",
          }}
        >
          Building scalable platforms, data architectures, and AI&#8209;powered
          systems. Turning strategic vision into production&#8209;ready code.
        </p>

        {/* CTA */}
        <div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s 0.7s",
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
            href="#about"
            className="w-full rounded-xl border border-white/10 px-8 py-3.5 text-[15px] font-medium text-zinc-300 transition-all hover:border-white/25 hover:text-white sm:w-auto"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s 1s",
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

// ─── About ─────────────────────────────────────────────────────────
function About() {
  return (
    <Section
      id="about"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      {/* Label */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          About
        </span>
      </div>

      {/* Heading */}
      <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        The developer behind the code
      </h2>

      {/* Two-column layout */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
        {/* Text */}
        <div className="space-y-5 text-[15px] leading-[1.8] text-zinc-400">
          <p>
            I&apos;m a Full Stack Developer at{" "}
            <span className="font-medium text-white">
              Bright Technology Ventures
            </span>
            , serving as the technical sparring partner for management and
            commercial teams. I design, build, and maintain digital platforms
            and intelligence solutions across multiple business units.
          </p>
          <p>
            Working autonomously, I translate strategic goals into scalable
            technical solutions &mdash; focusing on maintainability, data
            structure, and long-term value. My role bridges software
            development, data engineering, and business strategy.
          </p>
          <p>
            Before development, I spent 4 years as a{" "}
            <span className="font-medium text-white">
              Communication Specialist
            </span>{" "}
            at a real estate tech startup, scaling it from startup to scale-up.
            This unique background helps me bridge the gap between technical
            execution and business impact.
          </p>
        </div>

        {/* Sidebar cards */}
        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Current Focus
            </h3>
            <ul className="space-y-2.5 text-[13px] text-zinc-400">
              {[
                "Custom React / Next.js platforms",
                "First-party data architectures",
                "Market intelligence systems",
                "AI-powered automation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Core Strengths
            </h3>
            <ul className="space-y-2.5 text-[13px] text-zinc-400">
              {[
                "Business needs \u2192 technical solutions",
                "Zero-to-production builder",
                "Autonomous problem solving",
                "Data-driven decision making",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Experience ────────────────────────────────────────────────────
const jobs = [
  {
    period: "Jun 2024 \u2014 Present",
    role: "Full Stack Web Developer",
    company: "Bright Technology Ventures",
    current: true,
    text: "Technical sparring partner for management & commercial teams. Designing, building, and maintaining digital platforms and internal intelligence solutions across multiple business units.",
    tags: [
      "React & Next.js",
      "Data Architecture",
      "Market Intelligence",
      "AI Automation",
      "SEO Workflows",
    ],
  },
  {
    period: "Jan \u2014 Jun 2024",
    role: "Technical Marketer",
    company: "Bright Technology Ventures",
    current: false,
    text: "Combined marketing strategy with technical execution \u2014 website performance, data quality, Google Tag Manager, and HubSpot configuration for lead routing across multiple business units.",
    tags: ["GTM", "HubSpot", "Performance", "Commercial Growth"],
  },
  {
    period: "2019 \u2014 2023",
    role: "Communication Specialist",
    company: "Kode Vastgoed",
    current: false,
    text: "Helped scale the company from startup to scale-up. Built expertise in marketing, communications, and multi-channel content creation while driving stakeholder engagement.",
    tags: ["Content", "Stakeholders", "Startup Scaling"],
  },
];

function Experience() {
  return (
    <Section
      id="experience"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Experience
        </span>
      </div>
      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        Where I&apos;ve grown
      </h2>

      <div className="mt-14 flex flex-col gap-6">
        {jobs.map((job, i) => (
          <div
            key={i}
            className="card group relative overflow-hidden p-6 sm:p-8"
          >
            {/* Accent top edge for current */}
            {job.current && (
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            )}

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
        ))}
      </div>
    </Section>
  );
}

// ─── Projects ──────────────────────────────────────────────────────
const projects = [
  {
    title: "Beyond Bricks",
    sub: "SaaS Platform \u2014 Service Cost Management",
    text: "Solo-built a complete SaaS platform for digitally managing and settling service costs in the rental sector. Architecture, backend, frontend, security, payments, hosting \u2014 all from scratch.",
    stats: [
      { val: "52", label: "API Routes" },
      { val: "24", label: "DB Models" },
      { val: "Solo", label: "Built" },
    ],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Tailwind",
      "Vercel",
      "Redis",
      "Mollie",
    ],
    features: [
      "Role-based access control",
      "Mollie payments + webhooks",
      "HMAC verification",
      "Rate limiting & CSRF",
      "PDF generation + emails",
      "Admin monitoring dashboard",
    ],
    color: "#6ee7b7",
  },
  {
    title: "Sentinel",
    sub: "Autonomous Market Intelligence \u2014 R&D",
    text: 'Personal R&D project automating market & competitive analysis. Answers complex strategic questions like "What\'s happening in the market?" with scalable, serverless technology.',
    stats: [
      { val: "R&D", label: "Type" },
      { val: "Serverless", label: "Arch" },
      { val: "Async", label: "Processing" },
    ],
    tech: ["Python", "Docker", "AWS SQS", "LLMs", "Serverless"],
    features: [
      "Real-time signal collection",
      "LLM semantic analysis",
      "Automated reporting",
      "Async pipeline",
      "Scalable infrastructure",
    ],
    color: "#a78bfa",
  },
];

function Projects() {
  return (
    <Section
      id="projects"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Projects
        </span>
      </div>
      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        Built from scratch
      </h2>

      <div className="mt-14 flex flex-col gap-8">
        {projects.map((p, i) => (
          <div key={i} className="card group relative overflow-hidden">
            {/* Color accent line */}
            <div
              className="h-[2px]"
              style={{
                background: `linear-gradient(90deg, ${p.color}, transparent 80%)`,
              }}
            />

            {/* Hover glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: p.color }}
            />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">{p.sub}</p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-zinc-500">
                {p.text}
              </p>

              {/* Stats row */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {p.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-white/[0.03] p-4 text-center ring-1 ring-white/[0.04]"
                  >
                    <div className="text-xl font-black text-white sm:text-2xl">
                      {s.val}
                    </div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mt-8">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Key Features
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {p.features.map((f) => (
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

              {/* Tech */}
              <div className="mt-8 flex flex-wrap gap-2">
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
        ))}
      </div>
    </Section>
  );
}

// ─── Skills ────────────────────────────────────────────────────────
const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Python", "PostgreSQL", "Prisma", "REST APIs", "Redis"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Vercel", "AWS", "Docker", "Git"],
  },
  {
    title: "Data & AI",
    items: [
      "LLM Integration",
      "SQL Architecture",
      "Market Intelligence",
      "SEO Automation",
    ],
  },
  {
    title: "Marketing",
    items: [
      "Google Tag Manager",
      "HubSpot",
      "Content Strategy",
      "Stakeholder Comms",
    ],
  },
];

function Skills() {
  return (
    <Section
      id="skills"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-8 bg-accent/50" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Skills
        </span>
      </div>
      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        My toolkit
      </h2>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g) => (
          <div key={g.title} className="card flex h-full flex-col p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">
              {g.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-white/[0.03] px-3 py-1.5 text-[12px] text-zinc-500 ring-1 ring-white/[0.05] transition-colors hover:text-white"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────
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
          Let&apos;s talk
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-zinc-500 sm:text-base">
          Interested in working together? I&apos;m always open to discussing new
          opportunities and ideas.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <a
            href="mailto:g.bagmeijer@gmail.com"
            className="card group flex items-center gap-4 p-5 text-left"
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
          <a
            href="tel:+31645073445"
            className="card group flex items-center gap-4 p-5 text-left"
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

// ─── Footer ────────────────────────────────────────────────────────
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

// ─── Page ──────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="noise">
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
