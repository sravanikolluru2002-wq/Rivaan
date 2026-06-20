import React, { CSSProperties, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FrameCanvasProps = {
  images: HTMLImageElement[];
  totalFrames: number;
};

const RESIZE_DEBOUNCE_MS = 150;
const MAX_FALLBACK_DISTANCE = 20;

export default function FrameCanvas({ images, totalFrames }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef({ current: 0 });
  const resizeTimeoutRef = useRef<number | null>(null);
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 });
  const drawnFrameRef = useRef<number>(-1);

  const setCanvasSize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const context = canvas.getContext("2d");
    if (!context) return null;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    viewportRef.current = { width, height, dpr };
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    drawnFrameRef.current = -1;

    return context;
  }, []);

  const getLoadedFrame = React.useCallback(
    (frameIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
      const current = images[clampedIndex];
      if (current?.complete && current.naturalWidth > 0) {
        return current;
      }

      for (let offset = 1; offset <= MAX_FALLBACK_DISTANCE; offset += 1) {
        const before = clampedIndex - offset;
        if (before >= 0) {
          const beforeImage = images[before];
          if (beforeImage?.complete && beforeImage.naturalWidth > 0) {
            return beforeImage;
          }
        }

        const after = clampedIndex + offset;
        if (after < totalFrames) {
          const afterImage = images[after];
          if (afterImage?.complete && afterImage.naturalWidth > 0) {
            return afterImage;
          }
        }
      }

      return null;
    },
    [images, totalFrames]
  );

  const drawFrame = React.useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const roundedFrame = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex)));
      if (drawnFrameRef.current === roundedFrame) {
        return;
      }

      const image = getLoadedFrame(roundedFrame);
      if (!image) return;

      const { width, height } = viewportRef.current;
      const canvasRatio = width / height;
      const imageRatio = image.naturalWidth / image.naturalHeight;

      let drawWidth = 0;
      let drawHeight = 0;
      let drawX = 0;
      let drawY = 0;

      if (imageRatio > canvasRatio) {
        drawHeight = height;
        drawWidth = image.naturalWidth * (height / image.naturalHeight);
        drawX = (width - drawWidth) / 2;
      } else {
        drawWidth = width;
        drawHeight = image.naturalHeight * (width / image.naturalWidth);
        drawY = (height - drawHeight) / 2;
      }

      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      drawnFrameRef.current = roundedFrame;
    },
    [getLoadedFrame, totalFrames]
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    if (!images.length) return;

    setCanvasSize();

    const drawInitialFrame = () => drawFrame(0);
    const firstImage = images[0];

    if (firstImage?.complete && firstImage.naturalWidth > 0) {
      drawInitialFrame();
    } else if (firstImage) {
      firstImage.onload = () => {
        drawInitialFrame();
      };
    }

    const onResize = () => {
      if (resizeTimeoutRef.current != null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        setCanvasSize();
        drawFrame(Math.round(frameRef.current.current));
        ScrollTrigger.refresh();
      }, RESIZE_DEBOUNCE_MS);
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    timeline.to(frameRef.current, {
      current: totalFrames - 1,
      ease: "none",
      snap: { current: 1 },
      onUpdate: () => {
        drawFrame(Math.round(frameRef.current.current));
      },
    });

    const scrollTrigger = timeline.scrollTrigger;

    window.addEventListener("resize", onResize);
    window.requestAnimationFrame(() => {
      drawFrame(0);
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimeoutRef.current != null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      scrollTrigger?.kill();
      timeline.kill();
    };
  }, [drawFrame, images, setCanvasSize, totalFrames]);

  return <canvas ref={canvasRef} style={canvasStyle} />;
}

const canvasStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -10,
  pointerEvents: "none",
  display: "block",
};
