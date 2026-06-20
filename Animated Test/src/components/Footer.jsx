export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                </svg>
              </div>
              <span className="text-white text-xs tracking-[0.3em] uppercase font-light">
                Luxe Estates
              </span>
            </div>
            <p className="text-xs text-white/30 font-light leading-relaxed max-w-xs">
              Redefining luxury living since 2010. Curating the world&apos;s most exceptional
              properties for discerning buyers.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium mb-4">
                Navigate
              </h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Services', 'Contact'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-xs text-white/30 hover:text-white/70 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-white/30 hover:text-white/70 transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2 text-xs text-white/30 font-light">
              <li>hello@luxeestates.com</li>
              <li>+1 (555) 000-0000</li>
              <li>100 Luxury Avenue, Suite 2400</li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/20 tracking-wider">
            © 2026 Luxe Estates. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social icons */}
            {['X', 'In', 'Ig'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white/30 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
