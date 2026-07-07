"""
Comprehensive fix for all Rivan PWA files:

1. SYNC NAV across all 3 pages — same 5 tabs, same order everywhere:
   Home | Site Visits | My Lands | Payments | Profile

2. FIX content overlap with sidebar — add left offset to rv-scroll on desktop
   and add padding-left so content doesn't slide under the sidebar

3. FIX back/nav buttons — ensure padding-left on headers accounts for sidebar
"""

import re

# ═══════════════════════════════════════════════════════════════
# UNIFIED NAV CSS — same for all files
# ═══════════════════════════════════════════════════════════════
NAV_CSS_PATCH = """
  /* ─── Responsive Navigation ──────────────────────────────── */
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
    padding: 6px 8px;
    border-radius: 12px;
    transition: background .15s, color .15s;
    min-width: 44px;
  }
  .rv-nav-btn:hover { color: rgba(255,255,255,.85); background: rgba(255,255,255,.06); }
  .rv-nav-btn.active { color: #fff; }
  .rv-nav-btn.active svg { stroke: #fff; }
  .rv-nav-btn span.nav-label { font-size: 9px; font-weight: 700; white-space: nowrap; }
  .rv-nav-btn svg { transition: stroke .15s; }

  /* Scroll area: pad-bottom for bottom nav */
  .rv-scroll { padding-bottom: 74px !important; }

  /* ─── Desktop: left sidebar ──────────────────────────────── */
  @media (min-width: 768px) {
    .rv-nav {
      top: 0; right: auto; bottom: 0;
      width: 200px;
      height: 100%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 4px;
      padding: 28px 12px 28px;
      border-top: none;
      border-right: 1px solid rgba(255,255,255,.1);
      box-shadow: 4px 0 24px rgba(9,32,16,.2);
    }
    .rv-nav::before {
      content: '';
      display: block;
      width: 36px;
      height: 36px;
      background: url('assets/logo-mark-white.png') center/contain no-repeat;
      margin-bottom: 24px;
      margin-left: 6px;
      opacity: .9;
      flex: none;
    }
    .rv-nav-btn {
      flex-direction: row;
      justify-content: flex-start;
      gap: 10px;
      padding: 12px 14px;
      width: 100%;
      border-radius: 14px;
    }
    .rv-nav-btn span.nav-label { font-size: 13px; font-weight: 600; }
    .rv-nav-btn.active { background: rgba(255,255,255,.14); color: #fff; }

    /* Content shifts right past sidebar */
    .rv-scroll {
      padding-bottom: 24px !important;
      left: 200px !important;
      width: auto !important;
    }
  }
"""

# ═══════════════════════════════════════════════════════════════
# UNIFIED NAV HTML — same 5 tabs, same order, on every page
# active class is set per-page
# ═══════════════════════════════════════════════════════════════
def make_nav(active_tab):
    """active_tab: 'home' | 'visits' | 'lands' | 'payments' | 'profile'"""
    def cls(t):
        return 'rv-nav-btn active' if t == active_tab else 'rv-nav-btn'
    return f"""
    <!-- ===================== MAIN NAV ===================== -->
    <nav class="rv-nav">
      <button class="{cls('home')}" onClick="{{{{ goHome }}}}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span class="nav-label">Home</span>
      </button>
      <button class="{cls('visits')}" onClick="{{{{ goVisitsPage }}}}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span class="nav-label">Site Visits</span>
      </button>
      <button class="{cls('lands')}" onClick="{{{{ goLandsPage }}}}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span class="nav-label">My Lands</span>
      </button>
      <button class="{cls('payments')}" onClick="{{{{ goPayments }}}}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span class="nav-label">Payments</span>
      </button>
      <button class="{cls('profile')}" onClick="{{{{ goProfile }}}}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
"""

NAV_APP    = make_nav('home')    # active determined by JS in App
NAV_VISITS = make_nav('visits')
NAV_LANDS  = make_nav('lands')


def replace_css_nav_block(html, new_css):
    """Replace the .rv-nav { ... } CSS block with the new version"""
    pattern = re.compile(r'/\*\s*─+\s*(?:Navigation|Responsive Navigation).*?(?=\n  /\*|\Z)', re.DOTALL)
    if pattern.search(html):
        return pattern.sub(new_css.strip(), html)
    # Try different comment style
    pattern2 = re.compile(r'/\*\s*─+.*?Navigation.*?─+\s*\*/.*?(?=\n  /\*|\n</style>)', re.DOTALL)
    if pattern2.search(html):
        return pattern2.sub(new_css.strip(), html)
    print("  WARNING: Nav CSS block not found — inserting before </style>")
    html = html.replace('\n</style>', '\n' + new_css.strip() + '\n</style>')
    return html


def replace_nav_html(html, old_nav_pattern, new_nav):
    """Replace the <nav class='rv-nav'>...</nav> block"""
    pattern = re.compile(r'<!--\s*={5,} MAIN NAV ={5,}.*?-->\s*<nav class="rv-nav">.*?</nav>', re.DOTALL)
    if pattern.search(html):
        return pattern.sub(new_nav.strip(), html)
    print("  WARNING: Nav HTML block not found")
    return html


def fix_js_nav_functions_app(html):
    """Ensure App has goVisitsPage, goLandsPage, goPayments, goProfile, goHome"""
    # goVisitsPage already added in restore_nav.py, just make sure it redirects
    if 'goVisitsPage' not in html:
        html = html.replace(
            "goHome:()=>this.tab('home'),",
            "goHome:()=>this.tab('home'), goVisitsPage:()=>{ location.href='Rivan%20Visits.dc.html'; },"
        )
    if 'goLandsPage' not in html:
        html = html.replace(
            "goVisitsPage:()=>{ location.href='Rivan%20Visits.dc.html'; },",
            "goVisitsPage:()=>{ location.href='Rivan%20Visits.dc.html'; }, goLandsPage:()=>{ location.href='Rivan%20My%20Lands.dc.html'; },"
        )
    return html


def fix_js_nav_functions_visits(html):
    """Ensure Visits has goHome, goLandsPage, goPayments, goProfile, goVisitsPage"""
    replacements = {
        'goPaymentsPage': 'goPayments',
        'goProfilePage':  'goProfile',
    }
    for old, new in replacements.items():
        if old in html:
            # Add alias
            html = html.replace(
                f'{old}:()=>',
                f'{new}:()=>{old}:()=>'  # keep both
            )
    # goPayments alias
    if 'goPayments:' not in html:
        html = html.replace(
            'goPaymentsPage:()=>',
            'goPayments:()=>{ location.href=\'Rivan%20App.dc.html#payments\'; }, goPaymentsPage:()=>'
        )
    # goProfile alias
    if 'goProfile:' not in html and 'goProfile()' not in html:
        html = html.replace(
            'goProfilePage:()=>',
            'goProfile:()=>{ location.href=\'Rivan%20App.dc.html#profile\'; }, goProfilePage:()=>'
        )
    # goHome alias (visits uses goHomePage)
    if 'goHome:' not in html and 'goHomePage' in html:
        html = html.replace(
            'goHomePage:()=>',
            'goHome:()=>{ location.href=\'Rivan%20App.dc.html#home\'; }, goHomePage:()=>'
        )
    # goVisitsPage (stay on this page)
    if 'goVisitsTab' in html and 'goVisitsPage' not in html:
        html = html.replace('goVisitsTab:', 'goVisitsPage:()=>this.reset(\'visits\'), goVisitsTab:')
    return html


def fix_js_nav_functions_lands(html):
    """Ensure My Lands has goHome, goVisitsPage, goPayments, goProfile, goLandsPage"""
    if 'goPayments:' not in html:
        html = html.replace(
            'goPaymentsPage:()=>',
            'goPayments:()=>{ location.href=\'Rivan%20App.dc.html#payments\'; }, goPaymentsPage:()=>'
        )
    if 'goProfile:' not in html and 'goProfile()' not in html:
        html = html.replace(
            'goProfilePage:()=>',
            'goProfile:()=>{ location.href=\'Rivan%20App.dc.html#profile\'; }, goProfilePage:()=>'
        )
    if 'goHome:' not in html and 'goHomePage' in html:
        html = html.replace(
            'goHomePage:()=>',
            'goHome:()=>{ location.href=\'Rivan%20App.dc.html#home\'; }, goHomePage:()=>'
        )
    if 'goVisitsPage' not in html:
        html = html.replace(
            'goVisitsPage:()=>{ location.href=\'Rivan%20Visits.dc.html\'; }',
            'goVisitsPage:()=>{ location.href=\'Rivan%20Visits.dc.html\'; }'
        )
        if 'goVisitsPage' not in html:
            html = html.replace(
                "goProfile:()=>{ location.href='Rivan%20App.dc.html#profile'; },",
                "goProfile:()=>{ location.href='Rivan%20App.dc.html#profile'; }, goVisitsPage:()=>{ location.href='Rivan%20Visits.dc.html'; },"
            )
    if 'goLandsPage' not in html:
        html = html.replace(
            'goPayments:',
            "goLandsPage:()=>this.tab('lands'), goPayments:"
        )
    return html


# ─── Process RIVAN APP ─────────────────────────────────────────
print("=== Rivan App.dc.html ===")
fname = 'Rivan App.dc.html'
with open(fname, encoding='utf-8') as f:
    html = f.read()

# Replace CSS nav block
html = replace_css_nav_block(html, NAV_CSS_PATCH)

# Replace nav HTML with unified nav (App version uses dynamic active class via JS navClass*)
# The App nav uses {{ navClassHome }} etc — but to keep consistent labels, 
# we update to have the 5 correct tabs using the JS-driven active class
NAV_APP_DYNAMIC = """
    <!-- ===================== MAIN NAV ===================== -->
    <nav class="rv-nav">
      <button class="rv-nav-btn {{ navClassHome }}" onClick="{{ goHome }}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span class="nav-label">Home</span>
      </button>
      <button class="rv-nav-btn" onClick="{{ goVisitsPage }}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span class="nav-label">Site Visits</span>
      </button>
      <button class="rv-nav-btn {{ navClassProps }}" onClick="{{ goProps }}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span class="nav-label">My Lands</span>
      </button>
      <button class="rv-nav-btn {{ navClassPayments }}" onClick="{{ goPayments }}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span class="nav-label">Payments</span>
      </button>
      <button class="rv-nav-btn {{ navClassProfile }}" onClick="{{ goProfile }}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
"""
html = replace_nav_html(html, None, NAV_APP_DYNAMIC)
html = fix_js_nav_functions_app(html)

# Also make "My Lands" (props tab) link to My Lands page AND rename Props to My Lands in JS
# goProps already works as an inline tab — but nav says "My Lands" so let's make goProps
# link to the My Lands page for consistency
html = html.replace(
    "goProps:()=>this.tab('props')",
    "goProps:()=>{ location.href='Rivan%20My%20Lands.dc.html'; }"
)

with open(fname, 'w', encoding='utf-8') as f:
    f.write(html)
print("  Done.")


# ─── Process RIVAN VISITS ─────────────────────────────────────
print("=== Rivan Visits.dc.html ===")
fname = 'Rivan Visits.dc.html'
with open(fname, encoding='utf-8') as f:
    html = f.read()

html = replace_css_nav_block(html, NAV_CSS_PATCH)
html = replace_nav_html(html, None, NAV_VISITS.replace('{{ goHome }}','{{ goHome }}').replace('{{ goVisitsPage }}','{{ goVisitsPage }}').replace('{{ goLandsPage }}','{{ goLandsPage }}').replace('{{ goPayments }}','{{ goPayments }}').replace('{{ goProfile }}','{{ goProfile }}'))
html = fix_js_nav_functions_visits(html)

with open(fname, 'w', encoding='utf-8') as f:
    f.write(html)
print("  Done.")


# ─── Process RIVAN MY LANDS ───────────────────────────────────
print("=== Rivan My Lands.dc.html ===")
fname = 'Rivan My Lands.dc.html'
with open(fname, encoding='utf-8') as f:
    html = f.read()

html = replace_css_nav_block(html, NAV_CSS_PATCH)
html = replace_nav_html(html, None, NAV_LANDS.replace('{{ goHome }}','{{ goHome }}').replace('{{ goVisitsPage }}','{{ goVisitsPage }}').replace('{{ goLandsPage }}','{{ goLandsPage }}').replace('{{ goPayments }}','{{ goPayments }}').replace('{{ goProfile }}','{{ goProfile }}'))
html = fix_js_nav_functions_lands(html)

with open(fname, 'w', encoding='utf-8') as f:
    f.write(html)
print("  Done.")

print("\n=== ALL FIXES APPLIED ===")
