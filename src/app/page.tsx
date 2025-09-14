"use client";

import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";

import Header from "@/components/components/header";
import {

  WandSparkles,
} from "lucide-react";
import { CustomWalletButton } from "@/components/components/CustomWalletButton";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Analysis from "@/components/components/analysis";
import GlobalHistory from "@/components/components/globalHistory";
import Stats from "@/components/components/stats";
import { Component } from "@/components/ui/hero-section";

export default function Home() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const {publicKey} = useWallet();

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-black">
      <Component />
      <div className={`container mx-auto px-4 w-full pb-16 transition-opacity duration-300 ${publicKey ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ marginTop: '-80vh' }}>
        <Analysis />
      </div>

      {/* Footer with X icon */}
      <footer className="w-full py-8 flex justify-center items-center bg-black">
        <div className="flex items-center gap-2 text-white">
          <a
            href="https://x.com/freeclaimsol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
          >
            <FaXTwitter className="w-5 h-5" />
            <span className="text-sm">FreeSolClaim</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
