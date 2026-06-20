import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FrameCanvas({ images, totalFrames }) {
  const canvasRef = useRef(null);
  const frameRef = useRef({ current: 0 });

  /* Draw a single frame onto the canvas with cover-fit scaling */
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* Find the nearest loaded frame */
    let img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 20; offset++) {
        const before = images[frameIndex - offset];
        if (before && before.complete && before.naturalWidth > 0) { img = before; break; }
        const after = images[frameIndex + offset];
        if (after && after.complete && after.naturalWidth > 0) { img = after; break; }
      }
      if (!img || !img.complete || img.naturalWidth === 0) return;
    }

    /* Resize canvas to viewport */
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /* Cover-fit calculation (emulates background-size: cover) */
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawW, drawH, drawX, drawY;

    if (imgRatio > canvasRatio) {
      /* Image is wider — fit by height */
      drawH = canvas.height;
      drawW = img.naturalWidth * (canvas.height / img.naturalHeight);
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    } else {
      /* Image is taller — fit by width */
      drawW = canvas.width;
      drawH = img.naturalHeight * (canvas.width / img.naturalWidth);
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [images]);

  useEffect(() => {
    /* Draw the first frame immediately */
    drawFrame(0);

    /* Handle window resize */
    const handleResize = () => drawFrame(frameRef.current.current);
    window.addEventListener('resize', handleResize);

    /* GSAP ScrollTrigger animation */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });

    tl.to(frameRef.current, {
      current: totalFrames - 1,
      ease: 'none',
      snap: { current: 1 },
      onUpdate: () => {
        const index = Math.round(frameRef.current.current);
        drawFrame(index);
      },
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [images, totalFrames, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen fixed top-0 left-0 -z-10 transform-gpu"
      style={{ willChange: 'transform' }}
    />
  );
}
