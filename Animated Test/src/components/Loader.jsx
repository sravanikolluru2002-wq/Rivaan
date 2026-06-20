import { useEffect, useState } from 'react';

export default function Loader({ progress, isLoaded }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      /* small delay so user sees 100% briefly */
      const timer = setTimeout(() => setFadeOut(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (fadeOut) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06080d] transition-opacity duration-700 ${
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Logo mark */}
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
        </div>
        <span className="text-white/80 text-lg tracking-[0.35em] uppercase font-light">Luxe Estates</span>
      </div>

      {/* Percentage */}
      <div className="relative mb-8">
        <span className="text-7xl font-extralight tracking-tight text-white tabular-nums">
          {progress}
        </span>
        <span className="text-2xl font-extralight text-cyan-400 ml-1">%</span>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-[3px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)',
          }}
        />
      </div>

      {/* Loading text */}
      <p className="mt-6 text-xs tracking-[0.3em] uppercase text-white/30 font-light">
        Loading Experience
      </p>
    </div>
  );
}
