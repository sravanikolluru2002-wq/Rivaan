import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Section 2: About / Property Highlights ─── */
const PROPERTY_CARDS = [
  {
    id: 'card-skyline',
    tag: 'Featured',
    title: 'Skyline Penthouse',
    desc: 'A breathtaking 360° panoramic view from the 47th floor. Floor-to-ceiling glass, private rooftop terrace, and concierge service.',
    stats: ['4 Bed', '3 Bath', '3,200 sqft'],
  },
  {
    id: 'card-harbour',
    tag: 'New Listing',
    title: 'Harbour View Residence',
    desc: 'Waterfront luxury with direct marina access. Italian marble finishes, chef\'s kitchen, and resort-style amenities.',
    stats: ['3 Bed', '2 Bath', '2,800 sqft'],
  },
  {
    id: 'card-garden',
    tag: 'Exclusive',
    title: 'Botanical Garden Villa',
    desc: 'Nestled within 2 acres of curated gardens. Smart home integration, wine cellar, and infinity-edge pool.',
    stats: ['5 Bed', '4 Bath', '4,500 sqft'],
  },
];

/* ─── Section 3: Stats / Testimonial ─── */
const STATS = [
  { value: '2,400+', label: 'Properties Sold' },
  { value: '$3.2B', label: 'Portfolio Value' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '15+', label: 'Years of Excellence' },
];

export default function ScrollSections() {
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Section 2 cards stagger */
      gsap.utils.toArray('.property-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      /* Section 3 stats counter */
      gsap.utils.toArray('.stat-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      /* Section 4 fade-in */
      gsap.fromTo(
        section4Ref.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section4Ref.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ━━━ SECTION 2: Property Showcase ━━━ */}
      <section
        ref={section2Ref}
        id="about"
        className="relative min-h-[120vh] flex items-center py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.4em] uppercase text-cyan-400/80 font-medium">
              Curated Collection
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-white">
              Premium Properties
            </h2>
            <div className="mt-4 w-16 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </div>

          {/* Property cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTY_CARDS.map((card) => (
              <div
                key={card.id}
                id={card.id}
                className="property-card glass-card-hover p-6 md:p-8 transform-gpu"
              >
                {/* Tag */}
                <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-400/20 mb-5">
                  {card.tag}
                </span>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/40 font-light leading-relaxed mb-6">
                  {card.desc}
                </p>

                {/* Stats row */}
                <div className="flex gap-4 pt-4 border-t border-white/5">
                  {card.stats.map((stat) => (
                    <span
                      key={stat}
                      className="text-[11px] tracking-wider text-white/50 font-light"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 3: Stats & Social Proof ━━━ */}
      <section
        ref={section3Ref}
        id="services"
        className="relative min-h-[120vh] flex items-center py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-item glass-card p-6 md:p-8 text-center transform-gpu"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="glass-card max-w-2xl mx-auto p-8 md:p-12 text-center transform-gpu">
            {/* Quote icon */}
            <svg className="w-8 h-8 text-cyan-400/40 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
            </svg>

            <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed italic mb-8">
              "The team at Luxe Estates delivered an unparalleled experience. From the first viewing
              to the final signature, every detail was handled with extraordinary care and
              professionalism."
            </p>

            <div>
              <p className="text-sm font-semibold text-white tracking-wide">
                Alexandra Chen
              </p>
              <p className="text-xs text-white/30 tracking-wider uppercase mt-1">
                Penthouse Owner
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 4: CTA ━━━ */}
      <section
        ref={section4Ref}
        id="contact"
        className="relative min-h-[120vh] flex items-center justify-center py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-cyan-400/80 font-medium">
            Your Dream Awaits
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-white leading-tight">
            Begin Your Journey
          </h2>

          <p className="mt-6 text-sm text-white/40 font-light leading-relaxed max-w-md mx-auto">
            Schedule a private viewing and discover residences that redefine luxury. Our specialists
            are ready to guide you home.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="glow-btn text-white" id="cta-schedule-btn">
              Schedule Viewing
            </button>

            <button
              className="px-10 py-4 rounded-full text-sm tracking-widest uppercase font-semibold
                         border border-white/15 text-white/60 hover:text-white hover:border-white/30
                         transition-all duration-300 transform-gpu hover:scale-105"
              id="cta-contact-btn"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
