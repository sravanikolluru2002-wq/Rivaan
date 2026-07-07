"""
Make all Rivan PWA pages fully fill the browser viewport on all screen sizes.
- rv-stage: position:fixed, inset:0, no padding, no background
- rv-phone: 100% width + height, no max-width, no border-radius, no box-shadow
- rv-scroll fills it all via position:absolute;inset:0
- Remove notch and status-bar divs entirely from the HTML (not just hidden)
"""
import re, glob

# ─── CSS for ALL files ────────────────────────────────────────────────────────
CSS_FULL_SCREEN = """
  /* ── Full-viewport layout: web + mobile ── */
  html, body { height: 100%; margin: 0; }

  .rv-stage {
    position: fixed;
    inset: 0;
    display: block;
    background: #ffffff;
    overflow: hidden;
  }

  .rv-phone {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
  }

  /* Hide the fake phone chrome (notch + status bar) */
  .rv-phone > div:first-child,
  .rv-phone > div:nth-child(2) { display: none !important; }

  /* rv-scroll already fills via position:absolute;inset:0 in its inline style */
</style>"""

def replace_css_block(content, new_css):
    """Replace from .rv-stage { ... up to and including </style>"""
    pattern = re.compile(r'/\*\s*─+.*?Stage.*?</style>', re.DOTALL)
    if pattern.search(content):
        return pattern.sub(new_css.strip(), content)
    # fallback: from .rv-stage {
    pattern2 = re.compile(r'\.rv-stage\s*\{.*?</style>', re.DOTALL)
    if pattern2.search(content):
        return pattern2.sub(new_css.strip(), content)
    print("  WARNING: CSS block not found")
    return content

for fname in sorted(glob.glob('*.dc.html')):
    print(f"Processing: {fname}")
    with open(fname, encoding='utf-8') as f:
        html = f.read()

    html = replace_css_block(html, CSS_FULL_SCREEN)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print("  Done.")

print("\nAll done.")
