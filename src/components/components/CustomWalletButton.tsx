"use client";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { HoverBorderGradient } from "./FramerButton";

export const CustomWalletButton = () => {
  const { publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (publicKey) {
    // When wallet is connected, show the original WalletMultiButton with custom styling
    return (
      <WalletMultiButton className="!bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] !text-white !rounded-full !px-8 !py-2 !font-medium !text-lg !border-2 !border-[#5B698B] hover:!bg-[rgba(255,255,255,0.2)] transition-colors" />
    );
  }

  // When wallet is not connected, show the custom HoverBorderGradient button
  return (
    <div className="relative">
      {/* Hidden WalletMultiButton for modal functionality - only render on client */}
      {isClient && (
        <div className="absolute opacity-0 pointer-events-none">
          <WalletMultiButton />
        </div>
      )}

      {/* Custom styled button that triggers the hidden button */}
      <HoverBorderGradient
        className="bg-gradient-to-b from-[rgb(91,105,139)] to-[#828282] px-6 font-extralight py-3 text-[16px]"
        onClick={() => {
          // Only execute on client side
          if (isClient) {
            const hiddenButton = document.querySelector('.wallet-adapter-button');
            if (hiddenButton instanceof HTMLElement) {
              hiddenButton.click();
            }
          }
        }}
      >
        Connect Wallet
      </HoverBorderGradient>
    </div>
  );
};