import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#080808] px-5 text-center">
      <div className="font-mono text-[clamp(5rem,20vw,10rem)] font-black leading-none tracking-tighter text-white/[0.04]">
        404
      </div>
      <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#6ee7b7] hover:shadow-[0_0_32px_-4px_rgba(110,231,183,0.35)]"
      >
        Back to Home
      </Link>
      <div className="mt-12 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-700">
        <div className="h-px w-6 bg-zinc-800" />
        giovanni.dev
        <div className="h-px w-6 bg-zinc-800" />
      </div>
    </div>
  );
}
