import React, { useState, memo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Maximize2, Award, ZoomIn } from "lucide-react";

const Certificate = memo(({ ImgSertif }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <>
      {/* Thumbnail */}
      <motion.div
        ref={cardRef}
        className="group relative overflow-hidden cursor-pointer rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -6 }}
      >
        {/* Image container - using contain to show full certificate */}
        <div className="relative aspect-[4/3] overflow-hidden bg-background-secondary border border-border rounded-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton flex items-center justify-center">
              <Award className="w-8 h-8 text-foreground-muted/30" />
            </div>
          )}

          {/* Certificate image - object-contain to show full image */}
          <motion.img
            src={ImgSertif}
            alt="Certificate"
            className={`w-full h-full object-contain p-2 transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            animate={{ scale: isHovered ? 1.03 : 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ y: 15, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 15, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="p-4 rounded-full bg-accent/10 border border-accent/30">
                <ZoomIn className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <span className="font-sans text-body-sm text-foreground uppercase tracking-wider">
                View Certificate
              </span>
            </motion.div>
          </motion.div>

          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-accent/30 rounded-tl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-accent/30 rounded-br-lg" />
        </div>

        {/* Bottom border animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent-light to-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>

      {/* Full screen modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/98 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-background-secondary border border-border rounded-full text-foreground-muted hover:text-foreground hover:border-accent transition-all duration-300 z-10"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>

            {/* Certificate image - full view without cropping */}
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <img
                src={ImgSertif}
                alt="Certificate Full View"
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />

              {/* Decorative frame */}
              <motion.div
                className="absolute -inset-4 md:-inset-8 border border-accent/20 rounded-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              />

              {/* Corner decorations */}
              <motion.div
                className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-12 h-12 md:w-16 md:h-16 border-l-2 border-t-2 border-accent/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              />
              <motion.div
                className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 border-r-2 border-b-2 border-accent/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              />
            </motion.div>

            {/* Instructions */}
            <motion.p
              className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 font-sans text-caption text-foreground-muted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Click outside or press X to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Certificate;
