import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureBar from './components/FeatureBar';
import ScrollSections from './components/ScrollSections';
import Footer from './components/Footer';
import FrameCanvas from './components/FrameCanvas';

const TOTAL_FRAMES = 300;

function App() {
  const [images, setImages] = useState([]);

  /* ── Load all 300 frames in the background (non-blocking) ── */
  useEffect(() => {
    const imageArray = new Array(TOTAL_FRAMES);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/ezgif-22c7bd544cad92a0-png-split/ezgif-frame-${num}.png`;
      imageArray[i - 1] = img;
    }

    setImages(imageArray);
  }, []);

  return (
    <>
      {/* Fixed Canvas Background — renders whatever frames are available */}
      {images.length > 0 && <FrameCanvas images={images} totalFrames={TOTAL_FRAMES} />}

      {/* Scrollable Content Overlay — visible immediately */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeatureBar />
        <ScrollSections />
        <Footer />
      </div>
    </>
  );
}

export default App;
