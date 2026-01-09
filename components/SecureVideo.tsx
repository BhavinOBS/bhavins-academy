"use client";
import { useRef, useEffect, useState } from "react";

export default function SecureVideo({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      const container = containerRef.current;
      const video = videoRef.current;

      // If the video element went fullscreen by double-click
      if (fullscreenElement === video && container) {
        document.exitFullscreen().then(() => {
          container.requestFullscreen().catch(() => {});
        });
      }

      // Track state for watermark sizing
      setIsFullscreen(fullscreenElement === container);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!document.fullscreenElement && container) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg"
      style={{ aspectRatio: "16 / 9" }}
    >
      <video
        ref={videoRef}
        src={src}
        controls
        onContextMenu={handleContextMenu}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        className="w-full h-full object-contain"
      />

      {/* ✅ Watermark always visible in both normal and fullscreen */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 10,
          opacity: 0.25,
          color: "white",
          fontSize: isFullscreen ? "3vw" : "1.5rem",
          fontWeight: "bold",
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          userSelect: "none",
        }}
      >
        © Bhavin's Academy
      </div>

      {/* ✅ Custom fullscreen button */}
      <button
        onClick={handleFullscreen}
        className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded-md text-sm backdrop-blur z-20"
      >
        ⛶
      </button>
    </div>
  );
}

