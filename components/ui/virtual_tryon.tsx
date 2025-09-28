"use client";

import React from "react";

const VirtualTryOn = () => {
  return (
    <div
      onClick={() =>
        window.open(
          "https://virtual-try-on-cloths-gamma.vercel.app/",
        )
      }
      className="fixed top-1/2 left-0 transform -translate-y-1/2 
                 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700
                 hover:from-gray-800 hover:via-gray-700 hover:to-gray-600
                 text-white px-6 py-4 rounded-r-2xl cursor-pointer 
                 flex items-center space-x-3 shadow-xl hover:shadow-2xl
                 transition-all duration-500 hover:pl-8 hover:pr-12
                 hover:scale-105 z-50 group
                 border-l-4 border-gray-600 backdrop-blur-sm"
    >
      {/* Clothing Icon */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 transform group-hover:rotate-12 transition-transform duration-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-white/10 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      {/* Clear Descriptive Text */}
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-wide text-white drop-shadow-lg">
          Try Clothes On
        </span>
        <span className="font-medium text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Upload & see the fit
        </span>
      </div>

      {/* Animated Arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-70 group-hover:opacity-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
};

export default VirtualTryOn;
