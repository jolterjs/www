"use client";
import { useRef, useEffect, useState, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  automatic,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const textGradientId = `textGradient-${id}`;
  const revealMaskId = `revealMask-${id}`;
  const textMaskId = `textMask-${id}`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();

      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        setHovered(true);

        const ctm = svg.getScreenCTM();
        if (ctm && typeof svg.createSVGPoint === "function") {
          const point = svg.createSVGPoint();
          point.x = e.clientX;
          point.y = e.clientY;
          const svgPoint = point.matrixTransform(ctm.inverse());
          const viewBoxWidth = svg.viewBox.baseVal.width || 300;
          const viewBoxHeight = svg.viewBox.baseVal.height || 100;

          setMaskPosition({
            cx: `${(svgPoint.x / viewBoxWidth) * 100}%`,
            cy: `${(svgPoint.y / viewBoxHeight) * 100}%`,
          });
        } else {
          const cxPercentage = ((e.clientX - rect.left) / rect.width) * 100;
          const cyPercentage = ((e.clientY - rect.top) / rect.height) * 100;
          setMaskPosition({
            cx: `${cxPercentage}%`,
            cy: `${cyPercentage}%`,
          });
        }
      } else {
        setHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("cursor-none select-none", className)}
    >
      <defs>
        <linearGradient
          id={textGradientId}
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e5e5e5" />
              <stop offset="100%" stopColor="#ffffff" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id={revealMaskId}
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={textMaskId}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${revealMaskId})`}
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.2"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold transition-opacity duration-300 dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.2"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${textGradientId})`}
        strokeWidth="0.2"
        mask={`url(#${textMaskId})`}
        className="fill-transparent font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
