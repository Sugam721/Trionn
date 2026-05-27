import React from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";


export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const logoRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Logo fades + scales in
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      );

      // Hold for a moment
      tl.to(logoRef.current, { duration: 1 });

      // Logo fades out
      tl.to(logoRef.current, {
        opacity: 0,
        scale: 1.08,
        duration: 0.6,
        ease: "power2.in",
      });

      // Overlay wipes up
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.2",
      );

      tl.call(() => onComplete?.());
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-99999 overflow-hidden pointer-events-none"
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: "#0a0a0b" }}
      >
        <img
          ref={logoRef}
          src="https://res.cloudinary.com/dgfp5n7bn/image/upload/v1779816603/trionn-initial_vg71ry.png"
          alt="Logo"
          draggable={false}
          className="h-24 md:h-36 lg:h-44 w-auto object-contain select-none"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
