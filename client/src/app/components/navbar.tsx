"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { HouseSimple, ChatTeardrop, User, MagnifyingGlass, Plus, GearSix } from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";

function Navbar() {
  const [minimized, setMinimized] = useState(false);
  const [activePage, setActivePage] = useState<string>();

  const {
    theme: { colors },
  } = resolveConfig(tailwindConfig);

  const pathname = usePathname();

  const icons: Record<string, React.FC<{ size?: number }>> = {
    home: HouseSimple,
    inbox: ChatTeardrop,
    profile: User,
    search: MagnifyingGlass,
    create: Plus,
    settings: GearSix,
  };

  // if (!(pathname === "/")) return null;

  const iconComponent = (name: string) => {
    const IconFC = icons[name];
    return (
      <Link
        href={name === "home" ? "/" : name}
        className="flex flex-row mb-[2px] rounded-lg mx-2 hover:bg-active"
        style={{ backgroundColor: activePage === name ? colors.active : "" }}
      >
        <div className="p-3">
          <IconFC size={24} />
        </div>
        <motion.div
          className="items-center flex overflow-hidden"
          animate={{
            transition: {
              type: "tween",
              duration: 0.075,
            },
            width: minimized ? 0 : "auto",
            paddingRight: minimized ? 0 : 14,
          }}
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </motion.div>
      </Link>
    );
  };

  useEffect(() => {
    setActivePage(pathname === "/" ? "home" : pathname.slice(1));
  }, [pathname]);

  return (
    <div className="flex bg-primary flex-col w-fit" onMouseOver={() => setMinimized(false)} onMouseOut={() => setMinimized(true)}>
      <div className="flex flex-col flex-grow justify-between mt-20 mb-6">
        <div>
          <div>
            {iconComponent("home")}
            {iconComponent("inbox")}
            {iconComponent("profile")}
          </div>
          <div className=" mt-16">
            {iconComponent("search")}
            {iconComponent("create")}
          </div>
        </div>
        <div>{iconComponent("settings")}</div>
      </div>
    </div>
  );
}

export default Navbar;
