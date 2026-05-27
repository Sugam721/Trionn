import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

function Footer() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const torchWrapRef = useRef(null);
  const torchLitRef = useRef(null);
  const cursorRef = useRef(null);
  const roarRef = useRef(null);

  useEffect(() => {
    roarRef.current = new Audio("/sound/roar1.mp3");
    roarRef.current.volume = 0.5;
  }, []);
  // ── 1. GSAP Text Reveal ──────────────────────────────────────
  useGSAP(
    () => {
      gsap.set(["#footerFirstSpan", "#footerSecondSpan"], {
        backgroundImage:
          "linear-gradient(90deg, var(--text-color) 50%, var(--text-color-faded) 50%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
        backgroundPosition: "100% 0",
      });

      const commonScrollTrigger = (trigger) => ({
        trigger,
        start: isMobile ? "top bottom" : "top 95%",
        end: "bottom 20%",
        scrub: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: commonScrollTrigger("#footerFirstSpan"),
      });
      const t2 = gsap.timeline({
        scrollTrigger: commonScrollTrigger("#footerSecondSpan"),
      });
      const offsetX = isMobile ? 100 : 300;

      tl.fromTo(
        "#footerFirstSpan",
        { x: isMobile ? -50 : 0, backgroundPosition: "100% 0" },
        { x: 0, backgroundPosition: "0% 0", ease: "power2.out" },
      );
      t2.fromTo(
        "#footerSecondSpan",
        { x: -offsetX, backgroundPosition: "100% 0" },
        { x: 0, backgroundPosition: "0% 0", ease: "power2.out" },
      );
    },
    { dependencies: [isMobile] },
  );

  // ── 2. Torch Effect ─────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;

    const wrap = torchWrapRef.current;
    const lit = torchLitRef.current;
    const cursor = cursorRef.current;
    if (!wrap || !lit || !cursor) return;

    let curX = -999,
      curY = -999;
    let targetX = -999,
      targetY = -999;
    let rafId;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate() {
      curX = lerp(curX, targetX, 0.12);
      curY = lerp(curY, targetY, 0.12);
      lit.style.setProperty("--tx", curX + "px");
      lit.style.setProperty("--ty", curY + "px");
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    const onWrapMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const onWrapLeave = () => {
      targetX = -999;
      targetY = -999;
    };

    const onDocMove = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    wrap.addEventListener("mousemove", onWrapMove);
    wrap.addEventListener("mouseleave", onWrapLeave);
    document.addEventListener("mousemove", onDocMove);

    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener("mousemove", onWrapMove);
      wrap.removeEventListener("mouseleave", onWrapLeave);
      document.removeEventListener("mousemove", onDocMove);
    };
  }, [isMobile]);

  return (
    <div className="my-20 md:my-40 px-6 md:px-0">
      {/* Custom cursor */}
      {!isMobile && (
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "1.5px solid rgba(0,0,0,0.5)",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            transition: "opacity 0.3s",
          }}
          className="dark:border-[rgba(255,255,255,0.5)]"
        />
      )}

      <h3
        onMouseEnter={() => {
          if (roarRef.current) {
            roarRef.current.currentTime = 0;
            roarRef.current.play().catch(() => {});
          }
        }}
        className="text-6xl md:text-[190px] font-stretch-75% font-semibold leading-tight md:leading-36 tracking-tighter gap-0 uppercase flex flex-col items-center md:items-start text-center md:text-left"
      >
        <span id="footerFirstSpan">time to</span>
        <span id="footerSecondSpan">roar!</span>
      </h3>

      <div className="mt-14 md:mt-20 py-8 md:py-10 border-y flex flex-col md:flex-row justify-between border-black dark:border-white gap-10 md:gap-0">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-20">
          <div>
            <p className="text-sm uppercase opacity-60">Email</p>
            <p className="text-xl md:text-3xl">hello@gmail.com</p>
          </div>
          <div>
            <p className="text-sm uppercase opacity-60">call</p>
            <p className="text-xl md:text-3xl">+977 9864835573</p>
          </div>
        </div>
        <div>
          <p className="text-sm uppercase opacity-60">Teams</p>
          <p className="text-xl md:text-3xl">Talk to Trionn</p>
        </div>
      </div>

      {/* ── Copyright + Scroll To Top ── */}
      <div className="mt-10 md:mt-14 flex items-center justify-between">
        <p className="text-xl md:text-2xl text-center md:text-left">
          2026© TRIONN
        </p>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 md:w-14 md:h-14
             rounded-full border border-black dark:border-white
             flex items-center justify-center
             bg-white/80 dark:bg-black/60 backdrop-blur
             hover:scale-110 transition-transform duration-300"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

      {/* ── Full-Width Torch Banner: TRIONN ── */}
      <div
        ref={torchWrapRef}
        className="relative select-none overflow-hidden w-full mt-6 md:mt-10"
        style={{ cursor: isMobile ? "default" : "none" }}
      >
        {/* Dim base layer */}
        {/* was 0.07 — slightly more visible in light mode */}
        <p
          className="text-[clamp(4rem,20vw,18rem)] font-semibold uppercase tracking-tighter leading-none w-full text-center text-black dark:text-white"
          style={{ opacity: 0.12 }}
        >
          TRIONN
        </p>

        {/* Lit torch layer */}
        {!isMobile && (
          <div
            ref={torchLitRef}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              WebkitMaskImage:
                "radial-gradient(circle 160px at var(--tx, -999px) var(--ty, -999px), black 0%, transparent 100%)",
              maskImage:
                "radial-gradient(circle 160px at var(--tx, -999px) var(--ty, -999px), black 0%, transparent 100%)",
            }}
          >
            {/* lit layer slightly softer so it doesn't feel harsh in light mode */}
            <p
              className="text-[clamp(4rem,20vw,18rem)] font-semibold uppercase tracking-tighter leading-none w-full text-center text-black dark:text-white"
              style={{ opacity: 0.85 }}
            >
              TRIONN
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Footer;
