// components/ui/bytemy-loading-icon.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ByteMyLoadingIconProps {
  title?: string | undefined;
  description?: string | undefined;
  size?: "sm" | "default" | "lg" | undefined;
  showText?: boolean | undefined;
  className?: string | undefined;
}

export function ByteMyLoadingIcon({
  title = "Loading...",
  description = "Please wait while we fetch your data",
  size = "default",
  showText = true,
  className,
}: ByteMyLoadingIconProps) {
  const sizeMap = {
    sm: 32,
    default: 64,
    lg: 96,
  };

  const iconSize = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <span
        className="animate-fadePulse"
        style={{
          display: "inline-block",
          width: iconSize,
          height: iconSize,
          lineHeight: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 317 304"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0,304) scale(0.1,-0.1)"
            fill="#0591F7"
            stroke="none"
          >
            <path
              d="M615 2935 c-250 -46 -453 -234 -522 -485 -17 -60 -18 -129 -18 -920
0 -953 -3 -908 70 -1055 68 -138 172 -242 310 -309 149 -74 92 -70 1065 -74
569 -2 902 1 953 7 274 37 486 219 568 491 23 75 23 77 27 813 2 552 0 742 -9
753 -9 11 -43 14 -149 14 -188 0 -179 -9 -182 185 l-3 150 -166 3 c-140 2
-169 5 -180 19 -10 12 -15 69 -19 217 l-5 201 -835 2 c-644 1 -851 -2 -905
-12z m1305 -470 c17 -9 31 -17 32 -18 1 -1 4 -94 7 -207 l6 -205 156 -5 c110
-4 161 -9 172 -19 14 -11 17 -41 19 -195 l3 -181 141 -5 c99 -3 146 -9 158
-19 14 -12 16 -55 16 -435 0 -421 0 -421 -24 -471 -26 -56 -70 -98 -131 -126
-38 -18 -89 -19 -895 -19 -965 0 -896 -5 -979 80 -74 77 -72 42 -69 906 l3
769 27 46 c26 44 78 88 128 108 15 6 251 10 613 10 508 1 592 -1 617 -14z"
            />
          </g>
        </svg>
      </span>

      {showText && (
        <div className="text-center space-y-1">
          <h3
            className={`font-semibold text-gray-900 ${
              size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
            }`}
          >
            {title}
          </h3>
          {description && (
            <p
              className={`text-gray-600 ${
                size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-sm"
              }`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Convenience component for inline usage
export function ByteMySpinner({ 
  className,
  size = "sm" 
}: { 
  className?: string | undefined;
  size?: "sm" | "default" | "lg" | undefined;
}) {
  return <ByteMyLoadingIcon size={size} showText={false} className={className || ""} />;
}