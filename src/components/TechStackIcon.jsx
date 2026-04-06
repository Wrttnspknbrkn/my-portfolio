import React, { useState, memo, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TechStackIcon = memo(({ TechStackIcon, Language }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      className="group relative flex flex-col items-center justify-center p-4 sm:p-6 cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect background */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/20 via-accent/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(135deg, rgba(201, 168, 124, ${isHovered ? 0.4 : 0.1}) 0%, transparent 50%, rgba(201, 168, 124, ${isHovered ? 0.4 : 0.1}) 100%)`,
          padding: '1px',
        }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: isHovered ? 1 : 0.5 }}
      >
        <div className="w-full h-full rounded-lg bg-background-secondary" />
      </motion.div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center" style={{ transform: "translateZ(20px)" }}>
        {/* Icon with glow */}
        <div className="relative mb-3">
          {/* Glow ring */}
          <motion.div
            className="absolute inset-[-8px] rounded-full bg-accent/30 blur-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8 
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Orbiting dot */}
          <motion.div
            className="absolute w-1.5 h-1.5 bg-accent rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={isHovered ? {
              rotate: 360,
              x: [0, 24, 0, -24, 0],
              y: [-24, 0, 24, 0, -24],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 skeleton rounded-lg" />
          )}
          
          {/* Icon image */}
          <motion.img
            src={TechStackIcon}
            alt={`${Language} icon`}
            className={`w-10 h-10 sm:w-12 sm:h-12 object-contain relative z-10 transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0 absolute"
            }`}
            onLoad={() => setImageLoaded(true)}
            animate={{ 
              scale: isHovered ? 1.15 : 1,
              filter: isHovered ? 'drop-shadow(0 0 8px rgba(201, 168, 124, 0.5))' : 'none'
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Language name with underline animation */}
        <div className="relative">
          <motion.span 
            className="font-mono text-[10px] sm:text-caption text-foreground-muted group-hover:text-accent transition-colors duration-300 text-center block"
            animate={{ y: isHovered ? -2 : 0 }}
          >
            {Language}
          </motion.span>
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Corner accents */}
      <motion.div
        className="absolute top-1 left-1 w-2 h-2 border-l border-t border-accent/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-accent/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

export default TechStackIcon;
