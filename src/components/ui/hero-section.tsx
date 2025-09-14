"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CustomWalletButton } from "@/components/components/CustomWalletButton";
import { StardustButton } from "@/components/ui/stardust-button";
import { Liquid, Colors } from "@/components/ui/button-1";
import HeroWave from "@/components/ui/dynamic-wave-canvas-background";
import Stats from "@/components/components/stats";
import { WalletModal } from "@/components/ui/wallet-modal";
import { AnnouncementBanner } from "@/components/ui/announcement-banner";

const colors = {
  primary: "#4fd1c5", // teal/cyan
  secondary: "#8096D2", // blue
  accent: "#5B698B", // darker blue
  background: "#23263a", // dark blue/purple
  card: "#181c2b", // darker blue/purple
  text: "#ffffff",
  textMuted: "#ffffff80", // white/80
  textSubtle: "#ffffff60", // white/60
  border: "#ffffff15", // white/15
};

export function Component() {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleWalletConnect = () => {
    if (publicKey) {
      setIsWalletModalOpen(true);
    } else {
      // Only execute on client side to avoid hydration mismatch
      if (!isClient) return;

      // Use the same approach as CustomWalletButton - find and click the hidden wallet adapter button
      // First try to find by data attribute
      let hiddenButton = document.querySelector('[data-wallet-adapter="true"] button') as HTMLButtonElement;
      // If not found, try the standard wallet adapter button class
      if (!hiddenButton) {
        hiddenButton = document.querySelector('.wallet-adapter-button') as HTMLButtonElement;
      }
      // Last resort: find any wallet adapter button
      if (!hiddenButton) {
        hiddenButton = document.querySelector('button[class*="wallet-adapter"]') as HTMLButtonElement;
      }

      if (hiddenButton) {
        hiddenButton.click();
      } else {
        // Direct fallback using the modal hook
        if (setVisible) {
          setVisible(true);
        }
      }
    }
  };

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    if (!isClient) return;

    const words = document.querySelectorAll<HTMLElement>(".word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.8s ease-out forwards";
      }, delay);
    });

    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + "px";
        gradient.style.top = e.clientY - 192 + "px";
        gradient.style.opacity = "1";
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = "0";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px rgba(79, 209, 197, 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });

    function onClick(e: MouseEvent) {
      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      ripple.style.width = "4px";
      ripple.style.height = "4px";
      ripple.style.background = "rgba(79, 209, 197, 0.6)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "pulse-glow 1s ease-out forwards";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener("click", onClick);

    let scrolled = false;
    function onScroll() {
      if (!scrolled) {
        scrolled = true;
        document.querySelectorAll<HTMLElement>(".floating-element").forEach((el, index) => {
          setTimeout(() => {
            el.style.animationPlayState = "running";
          }, index * 200);
        });
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#23263a] via-[#181c2b] to-[#0f1419] text-white font-primary overflow-hidden relative w-full"
      style={{ minHeight: '200vh', paddingTop: '60px' }}
    >
      {/* Announcement Banner */}
      <AnnouncementBanner onClose={() => setIsBannerVisible(false)} />

      {/* Top-left brand logo using custom Zina font */}
      <div className="absolute top-6 left-6 z-20 select-none">
        <h1 className="font-zina text-4xl md:text-5xl leading-none text-white/95">
          claim<span className="font-bold">sol</span>
        </h1>
      </div>
      {/* Animated wave background */}
      <HeroWave />

      {/* Top-right wallet button - replaced with animated design, triggers wallet modal */}
      <TopRightAnimatedWalletButton onWalletClick={handleWalletConnect} />

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: "1s" }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: "2s" }} />
        <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: "3s" }} />
        <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: "4s" }} />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "5s", opacity: 0.05 }}
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          className="grid-line"
          style={{ animationDelay: "6s", opacity: 0.05 }}
        />
      </svg>



      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center gap-6 px-8 py-12 md:px-16 md:py-20">
        <div className="text-center">
          <img
            src="/Solana Logomark - Color.svg"
            alt="Solana logo"
            className="mx-auto mb-3 h-8 md:h-10 opacity-90"
            loading="eager"
            decoding="sync"
          />
          <h2
            className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] opacity-80"
            style={{ color: colors.textMuted }}
          >
            <span className="word" data-delay="0">Welcome</span>
            <span className="word" data-delay="400">to</span>
            <span className="word" data-delay="800"><b>Free claim sol</b></span>
            <span className="word" data-delay="1200">&nbsp;—&nbsp;</span>
            <span className="word" data-delay="1600">Recover</span>
            <span className="word" data-delay="2000">your</span>
            <span className="word" data-delay="2400">SOL.</span>
          </h2>
          <div
            className="mt-4 w-16 h-px opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)`,
            }}
          ></div>
        </div>

        <div className="text-center max-w-5xl mx-auto">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight text-decoration"
            style={{ color: colors.text }}
          >
            <div className="mb-4 md:mb-6">
              <span className="word" data-delay="3200">Connect</span>
              <span className="word" data-delay="3500">your</span>
              <span className="word" data-delay="3800">wallet</span>
              <span className="word" data-delay="4100">and</span>
              <span className="word" data-delay="4400">get</span>
              <span className="word" data-delay="4700">back</span>
              <span className="word" data-delay="5000">your</span>
              <span className="word" data-delay="5300">SOL</span>
            </div>
            <div
              className="text-2xl md:text-3xl lg:text-4xl font-thin leading-relaxed"
              style={{ color: colors.textMuted }}
            >
              <span className="word" data-delay="5600">Close</span>
              <span className="word" data-delay="5900">unused</span>
              <span className="word" data-delay="6200">ATAs</span>
              <span className="word" data-delay="6500">and</span>
              <span className="word" data-delay="6800">recover</span>
              <span className="word" data-delay="7100">locked</span>
              <span className="word" data-delay="7400">SOL</span>
            </div>
          </h1>
          <div
            className="absolute -left-8 top-1/2 w-4 h-px opacity-20"
            style={{
              background: colors.primary,
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "7s",
            }}
          ></div>
          <div
            className="absolute -right-8 top-1/2 w-4 h-px opacity-20"
            style={{
              background: colors.primary,
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "7.4s",
            }}
          ></div>
        </div>

        {/* Primary CTA - Stardust button triggers wallet connect */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <ConnectWalletStardust onWalletClick={handleWalletConnect}>
            Connect Wallet
          </ConnectWalletStardust>
          <p className="text-sm" style={{ color: colors.textSubtle }}>Securely connect your Solana wallet to get started</p>
        </div>

        <div className="text-center">
          <div
            className="mb-4 w-16 h-px opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)`,
            }}
          ></div>
          <h2
            className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em] opacity-80"
            style={{ color: colors.textMuted }}
          >
            <span className="word" data-delay="8800">Real-time</span>
            <span className="word" data-delay="9100">analysis,</span>
            <span className="word" data-delay="9400">seamless</span>
            <span className="word" data-delay="9700">recovery,</span>
            <span className="word" data-delay="10000">non-custodial</span>
            <span className="word" data-delay="10300">security.</span>
          </h2>
          <div
            className="mt-6 flex justify-center space-x-4 opacity-0"
            style={{
              animation: "word-appear 1s ease-out forwards",
              animationDelay: "9s",
            }}
          >
            <div
              className="w-1 h-1 rounded-full opacity-40"
              style={{ background: "black" }}
            ></div>
            <div
              className="w-1 h-1 rounded-full opacity-60"
              style={{ background: "black" }}
            ></div>
            <div
              className="w-1 h-1 rounded-full opacity-40"
              style={{ background: "black" }}
            ></div>
          </div>
        </div>

        {/* Inline stats just below the tagline, within the first screen */}
        <div className="w-full max-w-6xl mt-2">
          <Stats />
        </div>
      </div>

      <div
        id="mouse-gradient"
        ref={gradientRef}
        className="fixed pointer-events-none w-96 h-96 rounded-full blur-3xl transition-all duration-500 ease-out opacity-0"
        style={{
          background: `radial-gradient(circle, ${colors.primary}0D 0%, transparent 100%)`,
        }}
      ></div>

      {/* Hidden WalletMultiButton for programmatic access (used for initial wallet connect) */}
      <div className="absolute -top-10 -left-10 opacity-0 pointer-events-auto z-[-1]" data-wallet-adapter="true">
        <WalletMultiButton />
      </div>

      {/* Custom Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}

const ConnectWalletStardust: React.FC<{ children: React.ReactNode; onWalletClick: () => void }> = ({ children, onWalletClick }) => {
  const { publicKey } = useWallet();
  const label = publicKey ? `${publicKey.toBase58().slice(0,4)}...${publicKey.toBase58().slice(-4)}` : String(children);
  return (
    <StardustButton aria-label={publicKey ? "Wallet Connected" : "Connect Wallet"} onClick={onWalletClick}>
      {label}
    </StardustButton>
  );
};

const TopRightAnimatedWalletButton: React.FC<{ onWalletClick: () => void }> = ({ onWalletClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { publicKey } = useWallet();
  const COLORS: Colors = {
    color1: '#FFFFFF',
    color2: '#1E10C5',
    color3: '#9089E2',
    color4: '#FCFCFE',
    color5: '#F9F9FD',
    color6: '#B2B8E7',
    color7: '#0E2DCB',
    color8: '#0017E9',
    color9: '#4743EF',
    color10: '#7D7BF4',
    color11: '#0B06FC',
    color12: '#C5C1EA',
    color13: '#1403DE',
    color14: '#B6BAF6',
    color15: '#C1BEEB',
    color16: '#290ECB',
    color17: '#3F4CC0',
  };

  return (
    <div className="absolute top-6 right-6 z-20">
      <div className="relative inline-block w-40 h-[2.7em] group dark:bg-black bg-white dark:border-white border-black border-2 rounded-lg">
        <div className="absolute w-[112.81%] h-[128.57%] top-[8.57%] left-1/2 -translate-x-1/2 filter blur-[19px] opacity-70">
          <span className="absolute inset-0 rounded-lg bg-[#d9d9d9] filter blur-[6.5px]"></span>
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Liquid isHovered={isHovered} colors={COLORS} />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[92.23%] h-[112.85%] rounded-lg bg-[#010128] filter blur-[7.3px]"></div>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <span className="absolute inset-0 rounded-lg bg-[#d9d9d9]"></span>
          <span className="absolute inset-0 rounded-lg bg-black"></span>
          <Liquid isHovered={isHovered} colors={COLORS} />
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`absolute inset-0 rounded-lg border-solid border-[3px] border-gradient-to-b from-transparent to-white mix-blend-overlay filter ${i <= 2 ? 'blur-[3px]' : i === 3 ? 'blur-[5px]' : 'blur-[4px]'}`}></span>
          ))}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70.8%] h-[42.85%] rounded-lg filter blur-[15px] bg-[#006]"></span>
        </div>
        <button
          className="absolute inset-0 rounded-lg bg-transparent cursor-pointer"
          aria-label="Connect Wallet"
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onWalletClick}
        >
          <span className="flex items-center justify-center px-4 gap-2 rounded-lg text-white text-sm font-medium tracking-wide whitespace-nowrap">
            {publicKey ? `${publicKey.toBase58().slice(0,4)}...${publicKey.toBase58().slice(-4)}` : 'Connect'}
          </span>
        </button>
      </div>
    </div>
  );
};


