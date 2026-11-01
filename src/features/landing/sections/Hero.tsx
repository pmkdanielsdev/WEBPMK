"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AssembleHeroText from "./AssembleHeroText";
import MarqueeAyat from "@/components/MarqueeAyat";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    // Set initial centered transform for the background
    gsap.set(bgRef.current, { xPercent: -50, yPercent: -50 });
    
    // Background rotation
    gsap.to(bgRef.current, {
      rotate: 360,
      duration: 30,
      repeat: -1,
      ease: "none"
    });

    // Simulate pathLength animation using strokeDasharray and strokeDashoffset
    gsap.set([path1Ref.current, path2Ref.current], {
      strokeDasharray: 2500,
      strokeDashoffset: 2500
    });

    gsap.to(path1Ref.current, {
      strokeDashoffset: 0,
      duration: 5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(path2Ref.current, {
      strokeDashoffset: 0,
      duration: 7,
      delay: 1,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    // Tagline fade in
    gsap.from(textRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    });

  });

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100vh] px-4 pt-24 pb-24 text-center overflow-hidden bg-white">
      
      {/* Huge Rotating Gradient Background */}
      <div 
        ref={bgRef}
        className="absolute w-[200vmax] h-[200vmax] bg-gradient-to-r from-[#E2E2EF] from-20% via-[#FFFFFF] via-50% to-[#FFEED0] to-80% z-0"
        style={{ left: "50%", top: "50%" }}
      />

      {/* Abstract Animated Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3E4095" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#3E4095" stopOpacity="1" />
            <stop offset="100%" stopColor="#F58732" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F58732" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#F58732" stopOpacity="1" />
            <stop offset="100%" stopColor="#3E4095" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <path 
          ref={path1Ref}
          d="M-200 600 C 200 400, 600 800, 1000 500 S 1400 300, 1600 400"
          stroke="url(#lineGrad1)"
          strokeWidth="3"
          fill="none"
        />
        <path 
          ref={path2Ref}
          d="M-200 300 C 300 500, 700 100, 1100 400 S 1400 600, 1600 500"
          stroke="url(#lineGrad2)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      
      <p 
        ref={textRef}
        className="relative z-10 mb-6 text-lg font-bold tracking-widest text-black-500 uppercase"
      >
        PMK Daniel FILKOM UB.
      </p>

      {/* Judul Utama (Tagline) with Futuristic Vector Assemble Effect */}
      <AssembleHeroText />

      <MarqueeAyat />

    </section>
  );
}