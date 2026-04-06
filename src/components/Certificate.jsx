import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

const Certificate = memo(({ ImgSertif }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <motion.div
        className="group relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-foreground-muted/5">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}

          <motion.img
            src={ImgSertif}
            alt="Certificate"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ y: 10, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Maximize2
                className="w-6 h-6 text-accent"
                strokeWidth={1.5}
              />
              <span className="font-sans text-caption text-foreground uppercase tracking-wider">
                View
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Border accent */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 p-3 text-foreground-muted hover:text-foreground transition-colors z-10"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>

            {/* Image */}
            <motion.img
              src={ImgSertif}
              alt="Certificate Full View"
              className="relative max-w-full max-h-[85vh] object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Corner decorations */}
            <motion.div
              className="absolute top-8 left-8 w-16 h-16 border-l border-t border-accent/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-accent/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Certificate;
