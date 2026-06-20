import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        titleRef.current.children,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 }
      )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          btnRef.current,
          { y: 20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6 },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        {/* Title block */}
        <div ref={titleRef} className="overflow-hidden">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] uppercase text-white leading-tight mb-2">
            Business
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl tracking-[0.35em] uppercase font-light text-gradient mb-8">
            Landing Page Template
          </p>
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-sm sm:text-base text-white/60 font-light leading-relaxed max-w-lg mx-auto mb-10"
        >
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet.
        </p>

        {/* CTA Button */}
        <div ref={btnRef}>
          <button className="glow-btn text-white" id="hero-cta-btn">
            More
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
