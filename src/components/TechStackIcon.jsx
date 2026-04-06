import React, { useState, memo } from "react";
import { motion } from "framer-motion";

const TechStackIcon = memo(({ TechStackIcon, Language }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="group relative flex flex-col items-center justify-center p-6 border border-border hover:border-accent/50 transition-colors duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background accent */}
      <motion.div
        className="absolute inset-0 bg-accent/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container */}
      <div className="relative mb-3">
        {!imageLoaded && (
          <div className="w-12 h-12 skeleton rounded" />
        )}
        <motion.img
          src={TechStackIcon}
          alt={`${Language} icon`}
          className={`w-12 h-12 object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Language name */}
      <span className="font-sans text-caption text-foreground-muted group-hover:text-foreground transition-colors duration-300 text-center">
        {Language}
      </span>

      {/* Hover line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
});

export default TechStackIcon;
