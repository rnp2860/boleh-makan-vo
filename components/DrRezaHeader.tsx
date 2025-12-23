"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function DrRezaHeader() {
  const [greeting, setGreeting] = useState("Jom makan sihat!");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi! Dah sarapan?");
    else if (hour < 15) setGreeting("Selamat Tengahari! Makan apa tu?");
    else if (hour < 19) setGreeting("Selamat Petang! Teh tarik satu?");
    else setGreeting("Selamat Malam! Jangan makan lewat sangat.");
  }, []);

  return (
    <div className="flex items-center gap-3 w-full max-w-md mx-auto p-4 mb-2">
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-emerald-500 bg-white shadow-md overflow-hidden flex items-center justify-center">
          <Image
            src="/assets/avatar-header.png"
            alt="Dr. Reza"
            width={64}
            height={64}
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="relative bg-white border border-emerald-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex-1">
        <p className="text-emerald-900 font-medium text-sm">"{greeting}"</p>
        <p className="text-xs text-emerald-600 mt-1">Let's track your meal.</p>
        <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent transform rotate-90 drop-shadow-sm"></div>
      </div>
    </div>
  );
}