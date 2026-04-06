import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const containerRef = useRef(null);

  const words = ['Create', 'Design', 'Develop', 'Inspire'];

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Cycle through words
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 600);

    // Complete loading after animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 800);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(wordInterval);
    };
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const letterVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: (i) => ({
      y: -50,
      opacity: 0,
      transition: {
        delay: i * 0.02,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const name = "Kelvin Fameyeh";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201, 168, 124, 0.3) 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Accent line decoration */}
          <motion.div
            className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 80 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />

          <motion.div
            className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: -80 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />

          <div className="relative z-10 text-center px-6">
            {/* Small label */}
            <motion.p
              className="font-sans text-caption uppercase tracking-[0.3em] text-foreground-muted mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Portfolio
            </motion.p>

            {/* Main name - letter by letter */}
            <div className="overflow-hidden mb-6">
              <h1 className="font-serif text-display-lg text-foreground flex flex-wrap justify-center gap-x-4">
                {name.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="flex">
                    {word.split('').map((letter, letterIndex) => (
                      <motion.span
                        key={letterIndex}
                        custom={wordIndex * 10 + letterIndex}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-block"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>

            {/* Animated word carousel */}
            <div className="h-8 overflow-hidden mb-12">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentWord}
                  className="font-sans text-body-lg text-accent tracking-wide"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  {words[currentWord]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress indicator */}
            <div className="relative w-48 mx-auto">
              {/* Progress bar background */}
              <div className="h-px bg-foreground-muted/20 w-full" />
              
              {/* Progress bar fill */}
              <motion.div
                className="absolute top-0 left-0 h-px bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />

              {/* Progress number */}
              <motion.p
                className="font-sans text-caption text-foreground-muted mt-4 tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {progress}%
              </motion.p>
            </div>
          </div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-8 left-8 w-12 h-12 border-l border-t border-accent/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-accent/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
