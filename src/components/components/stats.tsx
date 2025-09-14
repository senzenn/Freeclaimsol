"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { UserCircle, Lock, BadgeX,BrushIcon,CircleDollarSign } from "lucide-react";

const statsData = [
  {
    label: "Total Users",
    icon: <UserCircle size={28} className="text-black-300/90" />,
    value: 110,
    color: "text-white",
    sub: "",
  },
  {
    label: "Accounts Closed",
    icon: <BadgeX size={28} className="text-black-300/90" />,
    value: 642,
    color: "text-white",
    sub: "",
  },
  {
    label: "SOL Refunded",
    icon: <CircleDollarSign size={28} className="text-black-400/90" />,
    value: 10.27,
    color: "text-[#4fd1c5]",
    sub: "SOL",
    isSol: true,
  },
];

function AnimatedNumber({ value, isSol = false, duration = 1.5 }: { value: number; isSol?: boolean; duration?: number }) {
  const [display, setDisplay] = useState(isSol ? 0 : 0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let start = isSol ? 0 : 0;
    const end = value;
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    function animate(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const current = isSol
        ? (progress * (end - start) + start)
        : Math.floor(progress * (end - start) + start);
      setDisplay(current);
      if (progress < 1) {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(animate);
        } else {
          // Fallback for environments without requestAnimationFrame
          setTimeout(() => animate(Date.now()), 16);
        }
      } else {
        setDisplay(end);
      }
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(animate);
    } else {
      // Fallback for environments without requestAnimationFrame
      setTimeout(() => animate(Date.now()), 16);
    }
    // eslint-disable-next-line
  }, [value, isSol, duration, isClient]);
  if (isSol) {
    return (
      <span>
        {display.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    );
  }
  return <span>{display.toLocaleString()}</span>;
}

const Stats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full py-4">
      {statsData.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2, duration: 1 }}
          className="backdrop-blur-md bg-gradient-to-b from-white/[0.04] to-black/[0.2] rounded-2xl px-8 py-8 flex flex-col items-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-white/10"
        >
          <div className="flex items-center gap-2 mb-3">
            {stat.icon}
            <span className="text-white/80 text-lg font-medium tracking-wide">{stat.label}</span>
          </div>
          <div className={`text-4xl font-semibold mt-1 ${stat.color} flex items-baseline drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]`}>
            <AnimatedNumber value={stat.value} isSol={stat.isSol} />
            {stat.isSol && <span className="ml-1 text-2xl font-semibold">SOL</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;