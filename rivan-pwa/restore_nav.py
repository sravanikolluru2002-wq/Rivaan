"""
Restore navigation to all Rivan PWA pages with responsive behavior:
- Mobile (≤768px): Bottom tab bar (original dark green style)
- Desktop (>768px): Left sidebar with icons + labels

Each page has its own tab set. Nav is injected inside .rv-phone
(which is now position:absolute;inset:0 = full viewport).
rv-scroll gets padding-left on desktop to account for sidebar.
"""

import re

# ═══════════════════════════════════════════════════════════════
# CSS to inject into every file's <style> block
# ═══════════════════════════════════════════════════════════════
NAV_CSS = """
  /* ─── Navigation: bottom on mobile, left sidebar on desktop ── */

  .rv-nav {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 68px;
    z-index: 40;
    background: linear-gradient(180deg, #1a5229 0%, #112e1a 100%);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 8px 6px;
    border-top: 1px solid rgba(255,255,255,.08);
    box-shadow: 0 -4px 20px rgba(9,32,16,.35);
  }

  .rv-nav-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: rgba(255,255,255,.5);
    font-family: inherit;
    padding: 6px 12px;
    border-radius: 12px;
    transition: background .15s, color .15s;
    min-width: 52px;
  }
  .rv-nav-btn:hover { color: rgba(255,255,255,.85); background: rgba(255,255,255,.06); }
  .rv-nav-btn.active { color: #fff; }
  .rv-nav-btn.active svg { stroke: #fff; }
  .rv-nav-btn span.nav-label { font-size: 10px; font-weight: 700; }
  .rv-nav-btn svg { transition: stroke .15s; }

  /* Scroll area accounts for bottom nav */
  .rv-scroll { padding-bottom: 74px !important; }

  /* ─── Desktop: left sidebar ─────────────────────────────────── */
  @media (min-width: 768px) {
    .rv-nav {
      top: 0;
      right: auto;
      bottom: 0;
      width: 80px;
      height: 100%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      padding: 24px 8px 24px;
      border-top: none;
      border-right: 1px solid rgba(255,255,255,.08);
      box-shadow: 4px 0 20px rgba(9,32,16,.2);
    }

    .rv-nav::before {
      content: '';
      display: block;
      width: 36px;
      height: 36px;
      background: url('assets/logo-mark-white.png') center/contain no-repeat;
      margin-bottom: 16px;
      opacity: .9;
    }

    .rv-nav-btn {
      width: 100%;
      padding: 10px 8px;
      border-radius: 14px;
    }

    .rv-nav-btn span.nav-label { font-size: 9.5px; }

    /* Scroll area shifts right to clear sidebar */
    .rv-scroll {
      padding-bottom: 24px !important;
      left: 80px !important;
      right: 0 !important;
      width: auto !important;
    }
  }

  @media (min-width: 1100px) {
    .rv-nav {
      width: 200px;
      align-items: flex-start;
      padding: 28px 12px;
    }
    .rv-nav::before { margin-left: 8px; margin-bottom: 24px; }
    .rv-nav-btn {
      flex-direction: row;
      justify-content: flex-start;
      gap: 10px;
      padding: 12px 14px;
      width: 100%;
      border-radius: 14px;
    }
    .rv-nav-btn span.nav-label { font-size: 13px; font-weight: 600; }
    .rv-nav-btn.active { background: rgba(255,255,255,.12); }
    .rv-scroll {
      left: 200px !important;
    }
  }
"""

# ═══════════════════════════════════════════════════════════════
# NAV HTML for Rivan App (Home, Explore, My Properties, Payments, Profile)
# Uses {{ navXxx }} for active colour via JS
# ═══════════════════════════════════════════════════════════════
NAV_APP = """
    <!-- ===================== MAIN NAV ===================== -->
    <nav class="rv-nav">
      <button class="rv-nav-btn {{ navClassHome }}" onClick="{{ goHome }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span class="nav-label">Home</span>
      </button>
      <button class="rv-nav-btn {{ navClassExplore }}" onClick="{{ goExplore }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-3.5-3.5"/></svg>
        <span class="nav-label">Explore</span>
      </button>
      <button class="rv-nav-btn {{ navClassProps }}" onClick="{{ goProps }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span class="nav-label">Properties</span>
      </button>
      <button class="rv-nav-btn {{ navClassPayments }}" onClick="{{ goPayments }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span class="nav-label">Payments</span>
      </button>
      <button class="rv-nav-btn {{ navClassProfile }}" onClick="{{ goProfile }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
"""

# ═══════════════════════════════════════════════════════════════
# NAV HTML for Rivan Visits (Home, My Lands, Payments, Visits*, Profile)
# ═══════════════════════════════════════════════════════════════
NAV_VISITS = """
    <!-- ===================== MAIN NAV ===================== -->
    <nav class="rv-nav">
      <button class="rv-nav-btn" onClick="{{ goHomePage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span class="nav-label">Home</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goLandsPage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span class="nav-label">My Lands</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goPaymentsPage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span class="nav-label">Payments</span>
      </button>
      <button class="rv-nav-btn active" onClick="{{ goVisitsTab }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span class="nav-label">Visits</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goProfilePage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
"""

# ═══════════════════════════════════════════════════════════════
# NAV HTML for Rivan My Lands (Home, My Lands*, Payments, Visits, Profile)
# ═══════════════════════════════════════════════════════════════
NAV_LANDS = """
    <!-- ===================== MAIN NAV ===================== -->
    <nav class="rv-nav">
      <button class="rv-nav-btn" onClick="{{ goHomePage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span class="nav-label">Home</span>
      </button>
      <button class="rv-nav-btn active" onClick="{{ goHomePage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span class="nav-label">My Lands</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goPaymentsPage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span class="nav-label">Payments</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goVisitsPage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span class="nav-label">Visits</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goProfilePage }}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
"""

# ═══════════════════════════════════════════════════════════════
# JS additions to Rivan App renderVals() for nav active classes
# Insert before the final `return {` line
# ═══════════════════════════════════════════════════════════════
JS_NAV_VARS = """
    const navClass = (t) => active === t ? 'active' : '';
    const navClassHome = navClass('home');
    const navClassExplore = navClass('explore');
    const navClassProps = navClass('props');
    const navClassPayments = navClass('payments');
    const navClassProfile = navClass('profile');
"""

# ═══════════════════════════════════════════════════════════════
# JS return additions for Rivan App
# ═══════════════════════════════════════════════════════════════
JS_RETURN_ADDITIONS = "      navClassHome, navClassExplore, navClassProps, navClassPayments, navClassProfile,"

# ────────────────────────────────────────────────────────────────
# Process RIVAN APP
# ────────────────────────────────────────────────────────────────
fname = 'Rivan App.dc.html'
print(f"Processing {fname}...")
with open(fname, encoding='utf-8') as f:
    html = f.read()

# 1) Inject nav CSS before </style>
html = html.replace('</style>\n</helmet>', NAV_CSS + '\n</style>\n</helmet>')

# 2) Inject nav HTML: insert before SUCCESS MODAL (which is position:absolute, stays on top)
# The nav goes inside rv-phone but outside rv-scroll
html = html.replace(
    '    <!-- ===================== SUCCESS MODAL ===================== -->',
    NAV_APP + '\n    <!-- ===================== SUCCESS MODAL ===================== -->'
)

# 3) Fix rv-scroll padding-bottom (CSS handles it, but remove hardcoded 24px)
html = html.replace(
    'style="position:absolute;inset:0;overflow-y:auto;padding-bottom:24px"',
    'style="position:absolute;inset:0;overflow-y:auto"'
)

# 4) Inject JS nav class variables before the final `return {`
html = html.replace(
    "    const mainTabs=['home','explore','props','payments','profile'];",
    "    const mainTabs=['home','explore','props','payments','profile'];\n" + JS_NAV_VARS
)

# 5) Add to return object
html = html.replace(
    "      switcher,\n    };",
    "      switcher,\n" + JS_RETURN_ADDITIONS + "\n    };"
)

with open(fname, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"  Done.")

# ────────────────────────────────────────────────────────────────
# Process RIVAN VISITS
# ────────────────────────────────────────────────────────────────
fname = 'Rivan Visits.dc.html'
print(f"Processing {fname}...")
with open(fname, encoding='utf-8') as f:
    html = f.read()

html = html.replace('</style>\n</helmet>', NAV_CSS + '\n</style>\n</helmet>')

# Inject nav before CANCEL MODAL
html = html.replace(
    '    <!-- CANCEL MODAL -->',
    NAV_VISITS + '\n    <!-- CANCEL MODAL -->'
)

# Fix rv-scroll padding
html = html.replace(
    'style="position:absolute;inset:0;overflow-y:auto;padding-bottom:24px"',
    'style="position:absolute;inset:0;overflow-y:auto"'
)

with open(fname, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"  Done.")

# ────────────────────────────────────────────────────────────────
# Process RIVAN MY LANDS
# ────────────────────────────────────────────────────────────────
fname = 'Rivan My Lands.dc.html'
print(f"Processing {fname}...")
with open(fname, encoding='utf-8') as f:
    html = f.read()

html = html.replace('</style>\n</helmet>', NAV_CSS + '\n</style>\n</helmet>')

# Find the last </div> before </div> </div> </x-dc> to inject nav
# Nav goes inside rv-phone but after rv-scroll ends
# Look for    </div>  (rv-scroll end) then   </div>  (rv-phone end)
# We insert between them
html = html.replace(
    '    </div>\n\n  </div>\n\n  \n</div>\n</x-dc>',
    '    </div>\n' + NAV_LANDS + '\n  </div>\n\n  \n</div>\n</x-dc>'
)

# Fix rv-scroll padding
html = html.replace(
    'style="position:absolute;inset:0;overflow-y:auto;padding-bottom:24px"',
    'style="position:absolute;inset:0;overflow-y:auto"'
)

with open(fname, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"  Done.")

print("\nAll files updated with responsive navigation!")
