"use client";
import { Component } from "@/components/ui/hero-section";
import Analysis from "@/components/components/analysis";
import { useWallet } from "@solana/wallet-adapter-react";

export default function DemoOne() {
  const { publicKey } = useWallet();
  return (
    <div className="flex flex-col">
      <Component />
      {publicKey && (
        <div className="container mx-auto px-4 w-full -mt-4 pb-16">
          <Analysis />
        </div>
      )}
    </div>
  );
}


