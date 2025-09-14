"use client";

import React, { useState } from "react";

interface AnnouncementBannerProps {
  message?: string;
  onClose?: () => void;
  className?: string;
}

export function AnnouncementBanner({
  message = "GeneriCon 2023 · Join us in Denver from June 7 – 9 to see what's coming next →",
  onClose,
  className = ""
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed w-screen top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 to-purple-800/90 backdrop-blur-sm border-b border-purple-700/30 ${className}`}>
      <div className="flex items-center justify-center px-4 py-3 text-center">
        <p className="text-white text-sm font-medium">
          {message}
        </p>
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200 p-1"
          aria-label="Close banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
