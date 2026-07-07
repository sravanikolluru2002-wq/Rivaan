"""
Add responsive content constraints to Rivan PWA.
- The app now fills 100% of the screen (rv-stage fixed, rv-phone absolute inset:0)
- On desktop, screen content needs a max-width container to stay readable
- We add .rv-screen max-width + centering for tablet/desktop
- The green header banner should always be full-width
- Content cards below the header get a max-width of 900px centered
"""
import re, glob

# We'll inject additional CSS rules right before the closing </style>
ADDITIONAL_CSS = """
  /* ─── Responsive content width for web ─────────────────────
     The green header spans full width. The scrollable content
     area below is capped and centered for comfortable reading. */

  /* Screen wrapper fills full height */
  .rv-screen { min-height: 100vh; min-height: 100dvh; }

  /* Inner content sections get responsive padding */
  @media (min-width: 768px) {
    /* Full-bleed header banners: stretch full width */
    .rv-screen > div:first-child {
      padding-left: clamp(22px, 6vw, 80px);
      padding-right: clamp(22px, 6vw, 80px);
    }
    /* Content area below header: capped width, centered */
    .rv-screen > div:not(:first-child) {
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
      padding-left: clamp(22px, 5vw, 60px);
      padding-right: clamp(22px, 5vw, 60px);
    }
  }

  @media (min-width: 1200px) {
    .rv-screen > div:first-child {
      padding-left: 10vw;
      padding-right: 10vw;
    }
  }
</style>"""

for fname in sorted(glob.glob('*.dc.html')):
    print(f"Processing: {fname}")
    with open(fname, encoding='utf-8') as f:
        html = f.read()

    # Insert additional CSS just before </style>
    if ADDITIONAL_CSS.strip() not in html:
        html = html.replace(
            '  /* rv-scroll already fills via position:absolute;inset:0 in its inline style */\n</style>',
            '  /* rv-scroll already fills via position:absolute;inset:0 in its inline style */' + ADDITIONAL_CSS
        )
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(html)
    print("  Done.")

print("\nAll done.")
