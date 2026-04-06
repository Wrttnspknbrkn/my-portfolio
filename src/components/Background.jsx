import React, { useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const AnimatedBackground = memo(() => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.08, 0.03]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.05, 0.02]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(201, 168, 124, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201, 168, 124, 0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201, 168, 124, 0.08) 0%, transparent 70%)',
          y: y1,
          opacity: opacity1,
        }}
      />
      
      <motion.div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201, 168, 124, 0.06) 0%, transparent 70%)',
          y: y2,
          opacity: opacity2,
        }}
      />

      <motion.div
        className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201, 168, 124, 0.05) 0%, transparent 70%)',
          y: y1,
          opacity: opacity2,
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

export default AnimatedBackground;
