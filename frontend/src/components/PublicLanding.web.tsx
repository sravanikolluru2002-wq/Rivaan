import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import FrameCanvas from "@/src/components/FrameCanvas";

const TOTAL_FRAMES = 136;
const FRAME_SOURCES = Array.from({ length: TOTAL_FRAMES }, (_, index) => {
  const frame = String(index + 1).padStart(3, "0");
  return `/frames/frame-${frame}.png`;
});

const LOGO_SRC = require("../../assets/images/rivan-logo.png");
const logoUrl =
  typeof LOGO_SRC === "string"
    ? LOGO_SRC
    : LOGO_SRC?.default || LOGO_SRC?.uri || "";

const NAV_LINKS = ["HOME", "ABOUT", "SERVICES", "CONTACT"];

const FEATURE_CARDS = [
  {
    title: "Customer discovery that converts",
    text: "Premium property discovery, layout visibility, and booking intent that lead naturally into the real workflow of this app.",
  },
  {
    title: "Site visits and booking continuity",
    text: "What starts on the customer side can continue into visit scheduling, follow-up handling, and booking progress without losing context.",
  },
  {
    title: "Agent CRM execution",
    text: "The same journey moves into leads, activities, tasks, and agent ownership instead of ending at a brochure-style landing page.",
  },
];

const WORKFLOW_COLUMNS = [
  {
    title: "Customer portal",
    items: [
      "Browse projects and inventory",
      "Inspect plot and unit availability",
      "Raise booking interest",
      "Continue into profile and services",
    ],
  },
  {
    title: "Agent workspace",
    items: [
      "Schedule and review site visits",
      "Track booking requests",
      "Manage customer leads",
      "Follow tasks and CRM activity",
    ],
  },
];

export default function PublicLanding() {
  const router = useRouter();
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousOverflow = document.body.style.overflowX;
    const previousBodyOverflowY = body.style.overflowY;
    const previousBodyMinHeight = body.style.minHeight;
    const previousBodyHeight = body.style.height;
    const previousHtmlOverflowY = html.style.overflowY;
    const previousHtmlHeight = html.style.height;

    body.style.overflowX = "hidden";
    body.style.overflowY = "auto";
    body.style.height = "auto";
    body.style.minHeight = "100vh";
    html.style.overflowY = "auto";
    html.style.height = "auto";

    return () => {
      body.style.overflowX = previousOverflow;
      body.style.overflowY = previousBodyOverflowY;
      body.style.minHeight = previousBodyMinHeight;
      body.style.height = previousBodyHeight;
      html.style.overflowY = previousHtmlOverflowY;
      html.style.height = previousHtmlHeight;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let isActive = true;
    let completed = 0;

    const loadFrames = async () => {
      const preloadedImages = await Promise.all(
        FRAME_SOURCES.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const image = new Image();
              image.decoding = "async";
              image.onload = async () => {
                completed += 1;
                if (isActive) {
                  setLoadedCount(completed);
                }

                try {
                  if (typeof image.decode === "function") {
                    await image.decode();
                  }
                } catch {
                  // Image is still usable even if decode rejects.
                }

                resolve(image);
              };
              image.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
              image.src = src;
            })
        )
      );

      if (!isActive) return;
      setImages(preloadedImages);
      setFramesReady(true);
    };

    loadFrames().catch(() => {
      if (!isActive) return;
      setFramesReady(false);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      {!framesReady ? <div style={posterBackgroundStyle} /> : null}
      {framesReady && images.length > 0 ? <FrameCanvas images={images} totalFrames={TOTAL_FRAMES} /> : null}

      <div style={pageOverlay}>
        <nav style={navStyle}>
          <div style={brandWrapStyle}>
            <div style={logoBadgeStyle}>
              {logoUrl ? (
                <img src={logoUrl} alt="Rivan logo" style={logoStyle} />
              ) : (
                <span style={fallbackHomeIconStyle}>R</span>
              )}
            </div>
            <span style={brandTextStyle}>RIVAN</span>
          </div>

          <div style={navLinksStyle}>
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} style={navLinkStyle}>
                {link}
              </a>
            ))}
          </div>
        </nav>

        <section id="home" style={heroSectionStyle}>
          <div style={heroShadeStyle} />
          <div style={heroContentStyle}>
            <h1 style={heroTitleStyle}>RIVAN</h1>
            <p style={heroKickerStyle}>REAL ESTATE CRM EXPERIENCE</p>
            <p style={heroBodyStyle}>
              Browse premium property inventory, inspect real availability, raise booking intent,
              schedule site visits, and continue the same customer flow inside the agent CRM workspace.
            </p>
            <button style={heroButtonStyle} onClick={() => router.push("/login")}>
              ENTER
            </button>
            {!framesReady ? (
              <div style={preloadNoteStyle}>Loading experience {loadedCount}/{TOTAL_FRAMES}</div>
            ) : null}
          </div>
          <div style={scrollIndicatorStyle}>
            <span style={scrollTextStyle}>SCROLL</span>
            <span style={scrollLineStyle} />
          </div>
        </section>

        <section id="about" style={sectionStyle}>
          <div style={sectionBackdropStyle} />
          <div style={sectionInnerStyle}>
            <div style={sectionHeaderStyle}>
              <span style={sectionLabelStyle}>ABOUT</span>
              <h2 style={sectionTitleStyle}>A landing page that belongs to the real app.</h2>
            </div>
            <div style={featureGridStyle}>
              {FEATURE_CARDS.map((card) => (
                <article key={card.title} style={glassCardStyle}>
                  <h3 style={cardTitleStyle}>{card.title}</h3>
                  <p style={cardTextStyle}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" style={sectionStyle}>
          <div style={sectionBackdropStyle} />
          <div style={sectionInnerStyle}>
            <div style={sectionHeaderStyle}>
              <span style={sectionLabelStyle}>SERVICES</span>
              <h2 style={sectionTitleStyle}>The customer and agent sides move together.</h2>
            </div>
            <div style={workflowGridStyle}>
              {WORKFLOW_COLUMNS.map((column) => (
                <article key={column.title} style={glassCardStyle}>
                  <h3 style={cardTitleStyle}>{column.title}</h3>
                  <div style={workflowListStyle}>
                    {column.items.map((item) => (
                      <div key={item} style={workflowItemStyle}>
                        <span style={workflowDotStyle} />
                        <span style={workflowTextStyle}>{item}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" style={sectionStyle}>
          <div style={sectionBackdropStyle} />
          <div style={sectionInnerStyle}>
            <div style={ctaPanelStyle}>
              <span style={sectionLabelStyle}>CONTACT</span>
              <h2 style={sectionTitleStyle}>Choose the right entry point into Rivan.</h2>
              <p style={cardTextStyle}>
                Customers should start with the discovery portal. Sales staff should continue inside the
                agent workspace and CRM console for visits, bookings, tasks, and lead handling.
              </p>
              <div style={ctaActionsStyle}>
                <button style={heroButtonStyle} onClick={() => router.push("/login")}>
                  CUSTOMER LOGIN
                </button>
                <button style={secondaryButtonStyle} onClick={() => router.push("/agent-login")}>
                  AGENT LOGIN
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer style={footerStyle}>
          <div style={footerShadeStyle} />
          <div style={footerInnerStyle}>
            <span>Rivan Reality LLP</span>
            <span>{year}</span>
          </div>
        </footer>
      </div>
    </>
  );
}

const baseFontFamily =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const posterBackgroundStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: -20,
  backgroundImage:
    "linear-gradient(to bottom, rgba(5,10,16,0.18), rgba(5,10,16,0.18)), url('/frames/frame-001.png')",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const pageOverlay: CSSProperties = {
  position: "relative",
  zIndex: 10,
  color: "#FFFFFF",
  fontFamily: baseFontFamily,
  minHeight: "400vh",
};

const navStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "30px 58px 0",
  boxSizing: "border-box",
};

const brandWrapStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const logoBadgeStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.92)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  overflow: "hidden",
};

const logoStyle: CSSProperties = {
  width: "28px",
  height: "28px",
  objectFit: "contain",
};

const fallbackHomeIconStyle: CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
  color: "#0B5D1E",
};

const brandTextStyle: CSSProperties = {
  fontSize: "15px",
  letterSpacing: "7px",
  color: "#FFFFFF",
  fontWeight: 400,
};

const navLinksStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "40px",
};

const navLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "rgba(255,255,255,0.9)",
  fontSize: "13px",
  letterSpacing: "5px",
  fontWeight: 500,
};

const heroSectionStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "120px 24px 140px",
  boxSizing: "border-box",
  background:
    "linear-gradient(to bottom, rgba(3,8,12,0.36), rgba(3,8,12,0.14) 45%, rgba(3,8,12,0.52) 100%)",
};

const heroShadeStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(6,12,20,0.22), transparent 44%, rgba(4,8,12,0.5) 100%)",
  pointerEvents: "none",
};

const heroContentStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "1180px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(72px, 14vw, 170px)",
  lineHeight: 1,
  letterSpacing: "14px",
  fontWeight: 900,
  color: "#FFFFFF",
};

const heroKickerStyle: CSSProperties = {
  margin: "20px 0 0",
  fontSize: "clamp(18px, 2.2vw, 36px)",
  lineHeight: 1.2,
  letterSpacing: "11px",
  color: "#2A9CFF",
};

const heroBodyStyle: CSSProperties = {
  margin: "26px auto 0",
  maxWidth: "860px",
  fontSize: "clamp(15px, 1.35vw, 19px)",
  lineHeight: 1.8,
  color: "rgba(255,255,255,0.74)",
};

const heroButtonStyle: CSSProperties = {
  marginTop: "34px",
  minWidth: "200px",
  minHeight: "76px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #2AC8F7, #1FA2F2)",
  color: "#FFFFFF",
  fontSize: "16px",
  letterSpacing: "3px",
  fontWeight: 800,
  cursor: "pointer",
  padding: "0 28px",
  boxShadow: "0 16px 36px rgba(25,162,242,0.28)",
};

const preloadNoteStyle: CSSProperties = {
  marginTop: "14px",
  fontSize: "11px",
  letterSpacing: "3px",
  color: "rgba(255,255,255,0.58)",
  textTransform: "uppercase",
};

const secondaryButtonStyle: CSSProperties = {
  ...heroButtonStyle,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "none",
};

const scrollIndicatorStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: "44px",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  zIndex: 2,
};

const scrollTextStyle: CSSProperties = {
  fontSize: "11px",
  letterSpacing: "5px",
  color: "rgba(255,255,255,0.52)",
};

const scrollLineStyle: CSSProperties = {
  width: "1px",
  height: "58px",
  background: "rgba(255,255,255,0.34)",
};

const sectionStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "110px 24px",
  boxSizing: "border-box",
  background:
    "linear-gradient(to bottom, rgba(3,8,12,0.42), rgba(3,8,12,0.12) 50%, rgba(3,8,12,0.48) 100%)",
};

const sectionBackdropStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(3,8,12,0.18), transparent 42%, rgba(3,6,9,0.52) 100%)",
  pointerEvents: "none",
};

const sectionInnerStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "1280px",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxWidth: "860px",
};

const sectionLabelStyle: CSSProperties = {
  fontSize: "12px",
  letterSpacing: "5px",
  color: "#2A9CFF",
  fontWeight: 700,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 4vw, 52px)",
  lineHeight: 1.1,
  color: "#FFFFFF",
  fontWeight: 800,
};

const featureGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const workflowGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "16px",
};

const glassCardStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "24px",
  background: "rgba(9,13,18,0.38)",
  padding: "24px",
  boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "22px",
  lineHeight: 1.25,
  color: "#FFFFFF",
  fontWeight: 700,
};

const cardTextStyle: CSSProperties = {
  margin: "14px 0 0",
  fontSize: "15px",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.74)",
};

const workflowListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginTop: "18px",
};

const workflowItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const workflowDotStyle: CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#2A9CFF",
  flexShrink: 0,
};

const workflowTextStyle: CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.5,
  color: "rgba(255,255,255,0.8)",
};

const ctaPanelStyle: CSSProperties = {
  ...glassCardStyle,
  borderRadius: "28px",
  padding: "30px",
};

const ctaActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "14px",
  marginTop: "18px",
};

const footerStyle: CSSProperties = {
  position: "relative",
  minHeight: "180px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: "0 24px 28px",
  boxSizing: "border-box",
  background: "linear-gradient(to top, rgba(3,5,7,0.72), rgba(3,5,7,0.22))",
};

const footerShadeStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(3,5,7,0.8), rgba(3,5,7,0.08))",
};

const footerInnerStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: "1280px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  fontSize: "13px",
  letterSpacing: "2px",
  color: "rgba(255,255,255,0.7)",
};
