import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const REPEAT = 16;
const BASE_SPEED = 0.55;

const Anime = () => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return;

    let topX = 0,
      botX = 0;
    let topHalf = top.scrollWidth / 2;
    let botHalf = bottom.scrollWidth / 2;
    let topMult = 1,
      botMult = 1;
    let lastY = window.scrollY;
    let eRaf = null,
      scrollTimer = null,
      rafId = null;

    const tick = () => {
      topX -= BASE_SPEED * topMult;
      botX += BASE_SPEED * botMult;
      if (Math.abs(topX) >= topHalf) topX = 0;
      if (botX >= botHalf) botX = 0;
      gsap.set(top, { x: topX, force3D: true });
      gsap.set(bottom, { x: botX, force3D: true });
      rafId = requestAnimationFrame(tick);
    };

    const easeBack = () => {
      if (eRaf) cancelAnimationFrame(eRaf);
      const step = () => {
        topMult += (1 - topMult) * 0.06;
        botMult += (1 - botMult) * 0.06;
        if (Math.abs(topMult - 1) > 0.001 || Math.abs(botMult - 1) > 0.001) {
          eRaf = requestAnimationFrame(step);
        } else {
          topMult = 1;
          botMult = 1;
        }
      };
      eRaf = requestAnimationFrame(step);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY;
      lastY = y;
      if (d > 0) {
        topMult = 3.5;
        botMult = 0.15;
      } else if (d < 0) {
        topMult = 0.15;
        botMult = 3.5;
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(easeBack, 80);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (eRaf) cancelAnimationFrame(eRaf);
      clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const items = Array(REPEAT).fill(null);

  return (
    <div className="w-full overflow-hidden py-10">
      {/* TOP STRIP */}
      <div
        className="flex items-center h-20 md:h-28 overflow-hidden
                      border-t border-b border-black/10 dark:border-white/10"
      >
        <span
          ref={topRef}
          className="inline-flex items-center whitespace-nowrap will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          {items.map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center px-6 md:px-10 select-none"
            >
              <span
                className="text-4xl md:text-6xl font-semibold tracking-tight uppercase
                               text-black dark:text-white"
              >
                wild idea&apos;s
              </span>
              <span
                className="mx-6 md:mx-10 w-1 h-1 rounded-full
                               bg-black/30 dark:bg-white/30"
              />
            </span>
          ))}
        </span>
      </div>

      {/* gap */}
      <div className="h-[5vh]" />

      {/* BOTTOM STRIP */}
      <div
        className="flex items-center h-20 md:h-28 overflow-hidden
                      border-t border-b border-black/10 dark:border-white/10"
      >
        <span
          ref={bottomRef}
          className="inline-flex items-center whitespace-nowrap will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          {items.map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center px-6 md:px-10 select-none"
            >
              <span
                className="text-4xl md:text-6xl font-semibold tracking-tight uppercase
                               text-black dark:text-white"
              >
                let&apos;s dive in!
              </span>
              <span
                className="mx-6 md:mx-10 w-1 h-1 rounded-full
                               bg-black/30 dark:bg-white/30"
              />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Anime;
