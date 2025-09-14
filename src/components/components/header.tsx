import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlignJustify, Phone } from "lucide-react";
import { CustomWalletButton } from "./CustomWalletButton";

const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="relative w-[80%] top-0 z-50 bg-[#0D0E0F] bg-transparent backdrop-blur-md border mt-8 rounded-xl border-[#252627]"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl text-white font-bold tracking-tight">
            get<span className="font-semibold">sol</span>
          </Link>
        </motion.div>

        <NavigationMenu className="bp2:hidden flex"></NavigationMenu>

        <AlignJustify className="w-6 h-6 bp3:flex hidden" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bp3:hidden flex items-center gap-4"
        >
          <div className="bp1:hidden flex">
            <CustomWalletButton />
          </div>
          <motion.button
            className="group relative bp1:flex hidden border-[2px] border-[#5B698B] overflow-hidden rounded-full bg-gradient-to-b from-[rgb(91,105,139)] to-[#414040] px-8 py-2 text-white backdrop-blur-sm transition-colors hover:bg-[rgba(255,255,255,0.2)]"
            onMouseMove={handleMouseMove}
            onHoverStart={() => setIsHovered2(true)}
            onHoverEnd={() => setIsHovered2(false)}
          >
            <Phone className="relative z-10 w-6 h-6" />
            {isHovered2 && (
              <motion.div
                className="absolute inset-0 z-0"
                animate={{
                  background: [
                    `radial-gradient(40px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 50%)`,
                  ],
                }}
                transition={{ duration: 0.15 }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;
