"""
Transform Rivan PWA files:
1. Strip the phone-shell wrapper (notch div, status-bar div) from ALL .dc.html files.
2. Make rv-stage fill the viewport on both desktop and mobile.
3. On desktop (>768px): rv-phone becomes a centred content column max-width 480px with subtle card shadow.
4. On mobile (<=768px): full-screen, no rounding, no shadow.
5. Remove the reviewer switcher block from ALL files.
6. Remove the bottom navigation bar from Rivan App.dc.html.
"""

import re, glob

# ──────────────────────────────────────────────────────────────
# NEW CSS BLOCK (replaces everything from .rv-stage to </style>)
# ──────────────────────────────────────────────────────────────
CSS_LOGIN = """
  /* ─── Stage / outer wrapper ─────────────────────────────── */
  .rv-stage {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    background: radial-gradient(140% 100% at 50% 0%, #eef4ea 0%, #e0ece0 55%, #d4e8d4 100%);
  }

  /* ─── Phone / content card ───────────────────────────────── */
  .rv-phone {
    width: 100%;
    max-width: 460px;
    min-height: 640px;
    background: #ffffff;
    border-radius: 32px;
    box-shadow:
      0 4px 6px -1px rgba(18,53,29,.06),
      0 20px 40px -12px rgba(18,53,29,.18),
      0 0 0 1px rgba(18,53,29,.05);
    position: relative;
    overflow: hidden;
    flex: none;
  }

  /* ─── Hide phone-shell chrome on desktop ─────────────────── */
  .rv-phone > div:first-child,
  .rv-phone > div:nth-child(2) { display: none !important; }

  /* ─── Mobile: full-screen, no card ───────────────────────── */
  @media (max-width: 600px) {
    .rv-stage {
      padding: 0;
      background: #ffffff;
      align-items: stretch;
    }
    .rv-phone {
      max-width: none;
      min-height: 100vh;
      min-height: 100dvh;
      border-radius: 0;
      box-shadow: none;
    }
  }
</style>"""

CSS_APP = """
  /* ─── Stage / outer wrapper ─────────────────────────────── */
  .rv-stage {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    background: radial-gradient(140% 100% at 50% 0%, #eef4ea 0%, #e0ece0 55%, #d4e8d4 100%);
  }

  /* ─── Phone / content card ───────────────────────────────── */
  .rv-phone {
    width: 100%;
    max-width: 460px;
    height: 800px;
    max-height: calc(100vh - 80px);
    background: #ffffff;
    border-radius: 32px;
    box-shadow:
      0 4px 6px -1px rgba(18,53,29,.06),
      0 24px 48px -12px rgba(18,53,29,.2),
      0 0 0 1px rgba(18,53,29,.05);
    position: relative;
    overflow: hidden;
    flex: none;
  }

  /* ─── Hide phone-shell chrome (notch + status bar) ───────── */
  .rv-phone > div:first-child,
  .rv-phone > div:nth-child(2) { display: none !important; }

  /* ─── Mobile: full-screen, no card ───────────────────────── */
  @media (max-width: 600px) {
    .rv-stage {
      padding: 0;
      background: #ffffff;
      align-items: stretch;
    }
    .rv-phone {
      max-width: none;
      height: 100vh;
      height: 100dvh;
      max-height: none;
      border-radius: 0;
      box-shadow: none;
    }
  }
</style>"""

# ──────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────

def strip_rv_stage_to_style(content, replacement):
    """Replace everything from .rv-stage { ... up to and including </style>"""
    # Match the injected block that starts with .rv-stage
    pattern = re.compile(r'\.rv-stage\s*\{.*?</style>', re.DOTALL)
    if not pattern.search(content):
        print("  WARNING: .rv-stage pattern not found – skipping CSS replace")
        return content
    return pattern.sub(replacement.strip(), content)

def remove_switcher(content):
    """Remove the reviewer switcher div block"""
    # Pattern 1: <!-- reviewer screen switcher --> ... </div>\n\n</div>
    content = re.sub(
        r'<!--[^>]*(?:reviewer|screen switcher)[^>]*-->\s*<div[^>]*>.*?</div>\s*\n\n</div>',
        '\n</div>',
        content, flags=re.DOTALL
    )
    # Pattern 2: plain <div style="display:flex...switcher..."> inside rv-stage
    content = re.sub(
        r'\n\s*<div style="display:flex[^"]*gap:[^"]*flex-wrap[^"]*>[^<]*<sc-for list="\{\{ switcher \}\}".*?</div>\s*\n',
        '\n',
        content, flags=re.DOTALL
    )
    return content

def remove_bottom_nav(content):
    """Remove the bottom nav bar from rv-phone"""
    # The bottom nav is wrapped in <sc-if value="{{ showNav }}" ...> ... </sc-if>
    content = re.sub(
        r'<!-- ={10,} BOTTOM NAV.*?</sc-if>',
        '',
        content, flags=re.DOTALL
    )
    # Also fix scrollPad: since nav is gone, padding-bottom can be 0
    content = content.replace('padding-bottom:{{ scrollPad }}', 'padding-bottom:24px')
    return content

def remove_inline_stage_style(content):
    """
    The rv-stage div has inline styles that fight the stylesheet.
    Strip those inline styles so the stylesheet wins.
    """
    content = re.sub(
        r'<div class="rv-stage" style="[^"]*"',
        '<div class="rv-stage"',
        content
    )
    return content

def remove_inline_phone_style(content):
    """
    The rv-phone div has heavy inline styles (width/height/box-shadow etc).
    Strip those so our stylesheet wins.
    """
    content = re.sub(
        r'<div class="rv-phone" style="[^"]*"',
        '<div class="rv-phone"',
        content
    )
    return content

# ──────────────────────────────────────────────────────────────
# Process each file
# ──────────────────────────────────────────────────────────────

files = glob.glob('*.dc.html')
for fname in sorted(files):
    print(f"Processing: {fname}")
    with open(fname, encoding='utf-8') as f:
        html = f.read()

    is_app = 'Rivan App' in fname
    css_replacement = CSS_APP if is_app else CSS_LOGIN

    html = strip_rv_stage_to_style(html, css_replacement)
    html = remove_switcher(html)
    html = remove_inline_stage_style(html)
    html = remove_inline_phone_style(html)

    if is_app:
        html = remove_bottom_nav(html)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"  Done.")

print("\nAll files processed.")
