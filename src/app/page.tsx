"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

/* -- Reveal on scroll ------------------------------------------------ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.7s cubic-bezier(.4,0,.2,1) ${delay}s, transform 0.7s cubic-bezier(.4,0,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* -- Navigation ------------------------------------------------------ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* Lock body scroll when mobile menu is open */
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
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: scrolled || open ? "rgba(5,5,5,0.85)" : "transparent",
        backdropFilter: scrolled || open ? "saturate(180%) blur(20px)" : "none",
        WebkitBackdropFilter:
          scrolled || open ? "saturate(180%) blur(20px)" : "none",
        borderBottom:
          scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#"
          className="relative text-xl font-black tracking-tighter text-white"
        >
          G<span className="text-accent">.</span>B
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-[13px] text-zinc-500 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-3 rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-[13px] font-medium text-accent transition-all hover:bg-accent/10"
          >
            Hire me
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="relative z-50 p-2 text-zinc-400 md:hidden"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? "420px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <nav className="border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl px-5 pb-6 pt-2 sm:px-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-4 text-sm text-zinc-400 transition-colors hover:text-accent last:border-0"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-xl border border-accent/20 bg-accent/5 px-5 py-3 text-center text-sm font-medium text-accent transition-all hover:bg-accent/10"
          >
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}

/* -- Staggered fade-in for hero --------------------------------------- */
function HeroReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {children}
    </div>
  );
}

/* -- Hero ------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/3 sm:h-[600px] sm:w-[900px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[250px] w-[400px] translate-x-1/4 translate-y-1/4 sm:h-[400px] sm:w-[600px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
        <HeroReveal delay={0.1}>
          <div className="mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/[0.04] px-3.5 py-1.5 sm:px-4">
              <span className="glow-dot h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-[10px] font-medium tracking-wide text-accent sm:text-xs">
                OPEN TO WORK
              </span>
            </span>
          </div>
        </HeroReveal>

        <HeroReveal delay={0.2}>
          <h1 className="text-[clamp(2.25rem,7vw,5.5rem)] font-black leading-[1.05] tracking-tighter text-white">
            Giovanni{" "}
            <span
              className="inline-block"
              style={{
                background:
                  "linear-gradient(135deg, #2dd4bf 0%, #06b6d4 40%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bagmeijer
            </span>
          </h1>
        </HeroReveal>

        <HeroReveal delay={0.35}>
          <div className="mx-auto mt-3 flex items-center justify-center gap-3 sm:mt-4">
            <div className="hidden h-px w-8 bg-gradient-to-r from-transparent to-accent/40 sm:block" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-sm sm:tracking-[0.25em]">
              Full Stack Developer
            </p>
            <div className="hidden h-px w-8 bg-gradient-to-l from-transparent to-accent/40 sm:block" />
          </div>
        </HeroReveal>

        <HeroReveal delay={0.5}>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-500 sm:mt-8 sm:max-w-lg sm:text-base md:text-lg">
            I build scalable platforms, data architectures, and AI&#8209;powered
            systems. Turning strategic vision into production&#8209;ready code.
          </p>
        </HeroReveal>

        <HeroReveal delay={0.65}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <a
              href="#projects"
              className="group relative w-full overflow-hidden rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-black transition-all hover:shadow-[0_0_40px_-8px_rgba(45,212,191,0.4)] sm:w-auto sm:px-8 sm:py-4"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
            <a
              href="#contact"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-7 py-3.5 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white sm:w-auto sm:px-8 sm:py-4"
            >
              Get in Touch
            </a>
          </div>
        </HeroReveal>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden animate-bounce justify-center sm:flex">
        <svg
          className="h-5 w-5 text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}

/* -- Section Header helper -------------------------------------------- */
function SectionHeader({
  label,
  heading,
  accent,
}: {
  label: string;
  heading: string;
  accent: string;
}) {
  return (
    <Reveal>
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent sm:text-xs">
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:mt-3 sm:text-4xl md:text-5xl">
        {heading}{" "}
        <span className="italic font-light text-zinc-500">{accent}</span>
      </h2>
    </Reveal>
  );
}

/* -- About ----------------------------------------------------------- */
function About() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 lg:py-32 px-5 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="About"
          heading="The"
          accent="developer behind the code."
        />

        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-5 lg:gap-12">
          {/* Text column */}
          <Reveal className="lg:col-span-3" delay={0.1}>
            <div className="space-y-5 text-[14px] leading-relaxed text-zinc-400 sm:text-[15px]">
              <p>
                I&apos;m a Full Stack Developer at{" "}
                <span className="font-medium text-white">
                  Bright Technology Ventures
                </span>
                , serving as the technical sparring partner for management and
                commercial teams. I design, build, and maintain digital
                platforms and intelligence solutions across multiple business
                units.
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
                at a real estate tech startup, scaling it from startup to
                scale-up. This unique background helps me bridge the gap
                between technical execution and business impact.
              </p>
            </div>
          </Reveal>

          {/* Cards column */}
          <Reveal className="lg:col-span-2" delay={0.2}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="glass rounded-2xl p-5 sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                  <span className="inline-block h-px w-4 bg-accent/50" />
                  Current Focus
                </h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  {["Custom React / Next.js platforms", "First-party data architectures", "Market intelligence systems", "AI-powered automation"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="glow-dot h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl p-5 sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                  <span className="inline-block h-px w-4 bg-accent/50" />
                  Core Strengths
                </h3>
                <ul className="space-y-3 text-sm text-zinc-400">
                  {["Business needs \u2192 technical solutions", "Zero-to-production builder", "Autonomous problem solving", "Data-driven decision making"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="glow-dot h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -- Experience ------------------------------------------------------ */
const jobs = [
  {
    period: "Jun 2024 \u2014 Now",
    role: "Full Stack Web Developer",
    company: "Bright Technology Ventures",
    badge: "Current",
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
    badge: "Full-time",
    text: "Combined marketing strategy with technical execution \u2014 website performance, data quality, Google Tag Manager, and HubSpot configuration for lead routing across multiple business units.",
    tags: ["GTM", "HubSpot", "Performance", "Commercial Growth"],
  },
  {
    period: "2019 \u2014 2023",
    role: "Communication Specialist",
    company: "Kode Vastgoed",
    badge: "Intern \u2192 Full-time",
    text: "Helped scale the company from startup to scale-up. Built expertise in marketing, communications, and multi-channel content creation while driving stakeholder engagement.",
    tags: ["Content", "Stakeholders", "Startup Scaling"],
  },
];

function Experience() {
  return (
    <section
      id="experience"
      className="relative py-20 sm:py-28 lg:py-32 px-5 sm:px-8 bg-bg-alt"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader
          label="Experience"
          heading="Where I've"
          accent="grown."
        />

        <div className="relative mt-12 sm:mt-16">
          {/* Vertical timeline line -- desktop only */}
          <div className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-accent/40 via-accent/10 to-transparent lg:block" />

          <div className="space-y-6 sm:space-y-8">
            {jobs.map((job, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative flex gap-6 lg:gap-8">
                  {/* Timeline dot -- desktop only */}
                  <div className="relative z-10 mt-1.5 hidden shrink-0 lg:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 bg-bg-alt">
                      <div className="glow-dot h-2.5 w-2.5 rounded-full bg-accent" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="glass w-full rounded-2xl p-5 sm:p-7 lg:p-8">
                    {/* Mobile accent bar for current job */}
                    {i === 0 && (
                      <div className="mb-4 h-0.5 w-12 rounded-full bg-accent/50 lg:hidden" />
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {job.role}
                        </h3>
                        <p className="text-sm text-accent">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0 sm:gap-3">
                        <span className="text-[11px] text-zinc-600 sm:text-xs">
                          {job.period}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            background:
                              i === 0
                                ? "rgba(45,212,191,0.1)"
                                : "rgba(255,255,255,0.04)",
                            color: i === 0 ? "#2dd4bf" : "#71717a",
                            border:
                              i === 0
                                ? "1px solid rgba(45,212,191,0.2)"
                                : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {job.badge}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-[13px] leading-relaxed text-zinc-500 sm:mt-4 sm:text-sm">
                      {job.text}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] text-zinc-500 sm:px-3 sm:text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -- Projects -------------------------------------------------------- */
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
    gradient: "linear-gradient(135deg, #2dd4bf, #06b6d4)",
  },
  {
    title: "Sentinel",
    sub: "Autonomous Market Intelligence \u2014 R&D",
    text: "Personal R&D project automating market & competitive analysis. Answers complex strategic questions like \"What's happening in the market?\" with scalable, serverless technology.",
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
    gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
  },
];

function Projects() {
  return (
    <section
      id="projects"
      className="relative py-20 sm:py-28 lg:py-32 px-5 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Projects"
          heading="Built from"
          accent="scratch."
        />

        <div className="mt-12 space-y-8 sm:mt-16 sm:space-y-10">
          {projects.map((p, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.01] transition-all duration-500 hover:border-white/[0.1] hover:shadow-2xl hover:shadow-black/30 sm:rounded-3xl">
                {/* Top gradient accent */}
                <div className="h-1" style={{ background: p.gradient }} />

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute -top-20 right-0 h-60 w-60 rounded-full opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: p.gradient }}
                />

                <div className="relative z-10 p-5 sm:p-8 lg:p-10">
                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                      {p.sub}
                    </p>
                  </div>

                  <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-zinc-500 sm:mt-5 sm:text-sm">
                    {p.text}
                  </p>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
                    {p.stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-4 text-center sm:rounded-xl sm:px-4 sm:py-5"
                      >
                        <div className="text-lg font-black text-white sm:text-2xl">
                          {s.val}
                        </div>
                        <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-600 sm:text-[10px]">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mt-6 sm:mt-8">
                    <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:mb-4">
                      Key Features
                    </h4>
                    <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 sm:gap-x-8">
                      {p.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2.5 text-[13px] text-zinc-500 sm:text-sm"
                        >
                          <svg
                            className="h-3 w-3 shrink-0 text-accent sm:h-3.5 sm:w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="mt-6 flex flex-wrap gap-1.5 sm:mt-8 sm:gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-zinc-500 transition-colors hover:border-accent/20 hover:text-accent sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -- Skills ---------------------------------------------------------- */
const skills = [
  {
    title: "Frontend",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: "Backend",
    icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2",
    items: [
      "Node.js",
      "Python",
      "PostgreSQL",
      "Prisma",
      "REST APIs",
      "Redis",
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    items: ["Vercel", "AWS", "Docker", "Git"],
  },
  {
    title: "Data & AI",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    items: [
      "LLM Integration",
      "SQL Architecture",
      "Market Intelligence",
      "SEO Automation",
    ],
  },
  {
    title: "Marketing",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
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
    <section
      id="skills"
      className="relative py-20 sm:py-28 lg:py-32 px-5 sm:px-8 bg-bg-alt"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeader label="Skills" heading="My" accent="toolkit." />

        <div className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {skills.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.07}>
              <div className="glass flex h-full flex-col rounded-2xl p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3 sm:mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/[0.07] text-accent sm:h-10 sm:w-10 sm:rounded-xl">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={g.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {g.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/[0.04] bg-white/[0.02] px-2.5 py-1 text-[11px] text-zinc-500 transition-colors hover:border-accent/15 hover:text-zinc-300 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -- Contact --------------------------------------------------------- */
function Contact() {
  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 lg:py-32 px-5 sm:px-8"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[400px] -translate-x-1/2 sm:h-[400px] sm:w-[600px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45,212,191,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <SectionHeader label="Contact" heading="Let's" accent="talk." />

        <Reveal delay={0.1}>
          <p className="mt-4 text-[13px] leading-relaxed text-zinc-500 sm:mt-5 sm:text-sm">
            Interested in working together? I&apos;m always open to discussing
            new opportunities and ideas.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
            <a
              href="mailto:g.bagmeijer@gmail.com"
              className="glass group flex items-center gap-3 rounded-2xl p-4 text-left sm:gap-4 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/[0.07] text-accent transition-colors group-hover:bg-accent/15 sm:h-11 sm:w-11">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Email
                </div>
                <div className="mt-0.5 truncate text-xs text-zinc-400 transition-colors group-hover:text-accent sm:text-sm">
                  g.bagmeijer@gmail.com
                </div>
              </div>
            </a>
            <a
              href="tel:+31645073445"
              className="glass group flex items-center gap-3 rounded-2xl p-4 text-left sm:gap-4 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/[0.07] text-accent transition-colors group-hover:bg-accent/15 sm:h-11 sm:w-11">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Phone
                </div>
                <div className="mt-0.5 text-xs text-zinc-400 transition-colors group-hover:text-accent sm:text-sm">
                  06-45073445
                </div>
              </div>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-600 sm:mt-8 sm:text-xs">
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
        </Reveal>
      </div>
    </section>
  );
}

/* -- Footer ---------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-white/5 px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row sm:gap-3">
        <span className="text-[11px] text-zinc-700 sm:text-xs">
          &copy; {new Date().getFullYear()} Giovanni Bagmeijer
        </span>
        <span className="text-[11px] text-zinc-800 sm:text-xs">
          Next.js &middot; Tailwind CSS &middot; Vercel
        </span>
      </div>
    </footer>
  );
}

/* -- Page ------------------------------------------------------------ */
export default function Home() {
  return (
    <div className="grain">
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
