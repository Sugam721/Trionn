import React, { useEffect, useRef } from "react";
/**
 * CustomCursor — "Magnetic Ink Drop"
 *
 * Three layers:
 *   1. SHARP DOT  — snaps to exact mouse position every frame (no lag)
 *   2. FLUID RING — lerps at 0.12 (silky trail), morphs on hover
 *   3. GHOST RING — lerps at 0.055 (very slow echo, fades in behind)
 *
 * Hover states (a, button, [data-cursor]):
 *   • Ring expands + fills with a semi-transparent teal wash
 *   • Ghost ring scales up even more, pulses gently
 *   • Dot hides (ring takes over visual focus)
 *
 * Click state:
 *   • Dot bursts (scale spike) then snaps back
 *   • Ring momentarily shrinks like a physical press
 *
 * All transforms via translate3d — compositor-only, zero layout thrash.
 * No external deps beyond React.
 */

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ghostRef = useRef(null);

  // Live mouse position (updated synchronously in mousemove)
  const mouse = useRef({ x: -200, y: -200 });
  // Smoothed positions for ring and ghost
  const rPos = useRef({ x: -200, y: -200 });
  const gPos = useRef({ x: -200, y: -200 });

  const state = useRef({
    hovered: false,
    clicking: false,
  });

  const raf = useRef(null);

  useEffect(() => {
    // Hide native cursor everywhere
    const styleTag = document.createElement("style");
    styleTag.textContent =
      "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(styleTag);

    /* ── helpers ── */
    const lerp = (a, b, t) => a + (b - a) * t;

    /* ── event handlers ── */
    const onMove = ({ clientX: x, clientY: y }) => {
      mouse.current.x = x;
      mouse.current.y = y;
    };

    const onOver = (e) => {
      if (
        e.target.closest("a, button, [data-cursor], input, textarea, select")
      ) {
        state.current.hovered = true;
      }
    };
    const onOut = (e) => {
      if (
        e.target.closest("a, button, [data-cursor], input, textarea, select")
      ) {
        state.current.hovered = false;
      }
    };

    const onDown = () => {
      state.current.clicking = true;
    };
    const onUp = () => {
      state.current.clicking = false;
    };

    /* ── RAF loop ── */
    const tick = () => {
      const { x: mx, y: my } = mouse.current;
      const { hovered, clicking } = state.current;

      // 1. Dot — instant (no lerp)
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
        dot.style.opacity = hovered ? "0" : "1";
        dot.style.scale = clicking ? "2.5" : "1";
      }

      // 2. Ring — fast lerp
      rPos.current.x = lerp(rPos.current.x, mx, 0.13);
      rPos.current.y = lerp(rPos.current.y, my, 0.13);

      const ring = ringRef.current;
      if (ring) {
        const scale = clicking ? 0.7 : hovered ? 1.6 : 1;
        ring.style.transform = `translate3d(${rPos.current.x}px,${rPos.current.y}px,0) scale(${scale})`;
        ring.style.background = hovered
          ? "rgba(99,194,184,0.15)"
          : "transparent";
        ring.style.borderColor = hovered
          ? "rgba(99,194,184,0.9)"
          : "rgba(255,255,255,0.55)";
        ring.style.boxShadow = hovered
          ? "0 0 18px rgba(99,194,184,0.35), inset 0 0 12px rgba(99,194,184,0.15)"
          : "none";
      }

      // 3. Ghost — very slow lerp
      gPos.current.x = lerp(gPos.current.x, mx, 0.05);
      gPos.current.y = lerp(gPos.current.y, my, 0.05);

      const ghost = ghostRef.current;
      if (ghost) {
        const gScale = clicking ? 0.5 : hovered ? 2.2 : 1.3;
        ghost.style.transform = `translate3d(${gPos.current.x}px,${gPos.current.y}px,0) scale(${gScale})`;
        ghost.style.opacity = hovered ? "0.35" : "0.12";
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.head.removeChild(styleTag);
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  /* ── shared inline transition (CSS prop, not Tailwind — more control) ── */
  const ringTransition =
    "background 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease, scale 0.2s ease, opacity 0.2s ease";

  return (
    <>
      {/* 1. SHARP DOT */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-9999 pointer-events-none"
        style={{
          willChange: "transform, opacity, scale",
          transition: "opacity 0.15s ease, scale 0.12s ease",
        }}
      >
        {/* outer glow ring around dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: "14px",
            height: "14px",
            top: "-7px",
            left: "-7px",
            background:
              "radial-gradient(circle, rgba(99,194,184,0.5) 0%, transparent 70%)",
          }}
        />
        {/* dot core */}
        <div
          className="rounded-full"
          style={{
            width: "5px",
            height: "5px",
            marginLeft: "-2.5px",
            marginTop: "-2.5px",
            background: "#63c2b8",
            boxShadow: "0 0 6px rgba(99,194,184,0.8)",
          }}
        />
      </div>

      {/* 2. FLUID RING */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-9998 pointer-events-none rounded-full border"
        style={{
          width: "36px",
          height: "36px",
          marginLeft: "-18px",
          marginTop: "-18px",
          borderColor: "rgba(255,255,255,0.55)",
          willChange: "transform",
          transition: ringTransition,
        }}
      />

      {/* 3. GHOST RING (slow echo) */}
      <div
        ref={ghostRef}
        className="fixed top-0 left-0 z-9997 pointer-events-none rounded-full border"
        style={{
          width: "36px",
          height: "36px",
          marginLeft: "-18px",
          marginTop: "-18px",
          borderColor: "rgba(99,194,184,0.4)",
          opacity: 0.12,
          willChange: "transform",
          transition: "opacity 0.3s ease",
        }}
      />
    </>
  );
}
