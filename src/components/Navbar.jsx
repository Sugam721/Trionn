import React, { useEffect, useRef, useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";


function Navbar() {
  const { toggleTheme, darkMode } = useTheme();

  // ───────────────── AUDIO ─────────────────
  const audioRef = useRef(null);
  const whooshRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  // ───────────────── MENU ─────────────────
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Work", href: "#" },
    { label: "Services", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }

    whooshRef.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.mp3",
    );

    whooshRef.current.volume = 0.3;
  }, []);

  // ───────────────── MUSIC TOGGLE ─────────────────
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // ───────────────── MENU TOGGLE ─────────────────
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);

    if (whooshRef.current) {
      whooshRef.current.currentTime = 0;
      whooshRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      {/* BACKGROUND MUSIC */}
      <audio ref={audioRef} loop>
        <source src="/sound/sound1.mp3" type="audio/mp3" />
      </audio>

      {/* ───────────────── NAVBAR ───────────────── */}
      <div className="pt-2 md:pt-9 fixed top-0 w-full left-0 z-50 flex items-center justify-between px-4 md:px-10">
        {/* LOGO */}
        {/* <img
          src="https://res.cloudinary.com/dgfp5n7bn/image/upload/v1779820778/logo_td7ady.svg"
          className="dark:invert w-24 md:w-auto cursor-pointer"
          alt="logo"
        /> */}

        <img
          src={
            darkMode
              ? "https://res.cloudinary.com/dgfp5n7bn/image/upload/v1779871968/Dark_Logo_qsyy0p.svg"
              : "https://res.cloudinary.com/dgfp5n7bn/image/upload/v1779820778/logo_td7ady.svg"
          }
          className="w-24 md:w-auto cursor-pointer"
          alt="logo"
        />

        {/* CENTER BUTTONS */}
        <div className="flex items-center gap-2 absolute left-[50%] translate-x-[-50%]">
          {/* THEME BUTTON */}
          <button
            className="cursor-pointer p-1 rounded-full flex items-center justify-center scale-90 md:scale-100"
            onClick={toggleTheme}
          >
            <div className="p-2 bg-[#DCE1E1] rounded-full">
              {darkMode ? (
                <IoSunny className="text-black dark:text-white" />
              ) : (
                <IoMoon className="text-black dark:text-white" />
              )}
            </div>
          </button>

          {/* MUSIC BUTTON */}
          <button
            onClick={toggleMusic}
            className="size-7 md:size-8 bg-[#DCE1E1] rounded-full p-1"
          >
            <img
              src={
                isPlaying
                  ? "https://res.cloudinary.com/dgfp5n7bn/image/upload/v1779820779/sound.b0076745_agxirj.svg"
                  : "https://res.cloudinary.com/dgfp5n7bn/image/upload/v1779809216/sound-mute.0o_yppys-cmtx_mvcvyi.svg"
              }
              alt=""
              className="invert dark:invert-0 size-full"
            />
          </button>
        </div>

        {/* MENU BUTTON */}
        <button
          onClick={toggleMenu}
          className="font text-sm md:text-lg flex gap-2 items-center cursor-pointer"
        >
          <span
            className={`hidden md:inline transition-all duration-300 ${
              menuOpen ? "opacity-0 translate-x-3" : "opacity-100 translate-x-0"
            }`}
          >
            MENU
          </span>

          <div className="p-1.5 md:p-2 bg-[#3f4144] dark:bg-[#DCE1E1] rounded-full">
            <CgMenuRight
              className={`text-xl md:text-2xl text-white dark:text-black transition-transform duration-300 ${
                menuOpen ? "rotate-90" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* ───────────────── FULLSCREEN MENU ───────────────── */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 px-6 md:px-16 flex flex-col justify-center
          ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* LINKS */}
        <ul className="flex flex-col gap-2 md:gap-4">
          {navLinks.map((link, i) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-6xl md:text-[8vw] font-black leading-none tracking-tight block transition-all duration-500"
                style={{
                  transitionDelay: menuOpen ? `${i * 80}ms` : "0ms",
                  transform: menuOpen ? "translateY(0)" : "translateY(40px)",
                  opacity: menuOpen ? 1 : 0,
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div
          className={`mt-16 border-t pt-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between
            ${darkMode ? "border-white/20" : "border-black/20"}`}
        >
          <p className="uppercase text-xs tracking-[0.3em] opacity-60">
            hello@gmail.com
          </p>

          <p className="uppercase text-xs tracking-[0.3em] opacity-60">
            +977 9864835573
          </p>

          <button
            className={`border px-6 py-3 rounded-full uppercase text-xs tracking-[0.3em] transition-all duration-300
              ${
                darkMode
                  ? "border-white hover:bg-white hover:text-black"
                  : "border-black hover:bg-black hover:text-white"
              }`}
          >
            Get in Touch
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
