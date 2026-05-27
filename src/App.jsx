import React, { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText, Draggable } from "gsap/all";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Achievements from "./components/Achievements";
import Information from "./components/Information";
import Dribble from "./components/Dribble";
import Social from "./components/Social";
import Footer from "./components/Footer";
import SmokeyCursor from "./components/SmokeyCursor";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import Anime from "./components/Anime";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      {/* Cursor always on top */}
      <CustomCursor />

      {/* Loader runs once, then unmounts */}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Main content hidden until loader finishes */}
      <main
        className="container mx-auto px-2 sm:px-0"
        style={{ visibility: loading ? "hidden" : "visible" }}
      >
        <SmokeyCursor
          autoColors={false}
          backgroundColor={{ r: 2, g: 2, b: 2 }}
          splatRadius={0.2}
          splatForce={5000}
          densityDissipation={6}
        />
        <Navbar />
        <Hero />
        <div className="h-187.5 hidden sm:block" />
        <Projects />
        <About />
        <Achievements />
        <Information />
        <Anime />
        <Dribble />
        <Social />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
