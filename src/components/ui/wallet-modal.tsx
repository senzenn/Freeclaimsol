"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Copy, RefreshCw, LogOut } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  const handleChangeWalletDirect = () => {
    // Try to open the wallet modal directly using the hook
    if (setVisible) {
      setVisible(true);
      return true;
    }
    return false;
  };

  const handleCopyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  const handleChangeWallet = () => {
    onClose();
    // Directly use the wallet modal hook to open the modal
    setTimeout(() => {
      console.log("Attempting to change wallet using direct modal hook...");
      const success = handleChangeWalletDirect();
      if (!success) {
        console.error("Could not open wallet modal using direct hook");
      }
    }, 150);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onClose();
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  if (!isOpen || !publicKey) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Hidden WalletMultiButton for programmatic access */}
      <div className="hidden">
        <WalletMultiButton />
      </div>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black rounded-2xl p-6 min-w-[280px] shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-white font-semibold text-lg">Wallet Connected</h3>
          <p className="text-gray-400 text-sm mt-1">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Copy Address */}
          <button
            onClick={handleCopyAddress}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-white font-medium transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? "Copied!" : "Copy address"}</span>
          </button>

          {/* Change Wallet */}
          <button
            onClick={handleChangeWallet}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-white font-medium transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Change wallet</span>
          </button>

          {/* Disconnect */}
          <button
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-red-900/20 hover:bg-red-800/30 rounded-xl text-red-400 font-medium transition-all duration-200 border border-red-800/30 hover:border-red-700/50"
          >
            <LogOut className="w-5 h-5" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
