import re, glob

CSS_FULLSCREEN = """
  /* ─── Stage / outer wrapper ─────────────────────────────── */
  .rv-stage {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 0;
    background: #ffffff;
  }

  /* ─── Phone / content card ───────────────────────────────── */
  .rv-phone {
    width: 100%;
    max-width: none;
    min-height: 100vh;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    background: #ffffff;
    border-radius: 0;
    box-shadow: none;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    flex: none;
  }

  /* ─── Hide phone-shell chrome on desktop ─────────────────── */
  .rv-phone > div:first-child,
  .rv-phone > div:nth-child(2) { display: none !important; }
</style>"""

def strip_rv_stage_to_style(content):
    pattern = re.compile(r'\.rv-stage\s*\{.*?</style>', re.DOTALL)
    if not pattern.search(content):
        return content
    return pattern.sub(CSS_FULLSCREEN.strip(), content)

files = glob.glob('*.dc.html')
for fname in sorted(files):
    if 'Admin' in fname or 'Agent' in fname:
        continue # Skip dashboards
    print(f"Processing: {fname}")
    with open(fname, encoding='utf-8') as f:
        html = f.read()

    html = strip_rv_stage_to_style(html)

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  Done.")
