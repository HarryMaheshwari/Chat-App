import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChatNavbar = () => {
  return (
    <div className="relative w-full h-16 bg-[#111827] border-b border-[#1f2937] px-4 flex items-center justify-between shadow-md overflow-hidden">
      
      {/* Glow background beam */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-[#00FFC6] to-transparent blur-sm animate-pulse opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="relative z-10 p-2 rounded-full hover:bg-[#1f2937] transition-all duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 group-hover:text-[#00FFC6] transition-transform duration-300" />
      </Link>

      {/* Center Title */}
      <h1 className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-semibold text-white text-lg tracking-wider select-none">
        <span className="relative">
          <span className="text-[#00FFC6]">Buddy</span>
          <span className="text-white">Bell</span>

          {/* Neon underline beam */}
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-[#00FFC6] via-white to-[#00FFC6] blur-sm opacity-70 animate-glowLine" />
        </span>
      </h1>

      {/* Empty space to balance layout */}
      <div className="w-9" />
    </div>
  );
};

export default ChatNavbar;
