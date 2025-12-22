"use client";
import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

export default function Header() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <header
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className="row-start-1 flex items-center justify-between w-full
        bg-blue-100 dark:bg-blue-900 px-6 gap-4 relative overflow-hidden
        transition-colors duration-[var(--theme-transition-duration)] ease-in-out
        sticky top-0 z-50"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(
            400px circle at ${pos.x}px ${pos.y}px,
            rgba(255,255,255,0.25),
            transparent 80%
          )`,
        }}
      />

      <Image
        className="dark:invert transition-all duration-[var(--theme-transition-duration)] ease-in-out"
        src="/logo.png"
        alt="Swap Spot logo"
        width={90}
        height={90}
        priority
      />
      <SearchBar />
      <ThemeToggle />
    </header>
  );
}