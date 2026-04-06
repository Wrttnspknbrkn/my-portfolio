import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const particlesRef = useRef(null);

  const words = ['Create', 'Design', 'Develop', 'Inspire'];

  // GSAP particle animations
  useEffect(() => {
    if (particlesRef.current) {
      const particles = particlesRef.current.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: 'random(-100, 100)',
          x: 'random(-50, 50)',
          opacity: 'random(0.3, 1)',
          duration: 'random(3, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.1,
        });
      });
    }
  }, []);

  useEffect(() => {
    // Animate progress bar with GSAP for smoother effect
    gsap.to(progressBarRef.current, {
      width: '100%',
      duration: 4.8,
      ease: 'power2.inOut',
      onUpdate: function() {
        const progress = Math.round(this.progress() * 100);
        setProgress(progress);
      }
    });

    // Cycle through words - slower pace for readability
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1200);

    // Complete loading after animation - extended for better word display
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 800);
    }, 5200);

    return () => {
      clearTimeout(timer);
      clearInterval(wordInterval);
    };
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const letterVariants = {
    hidden: { y: 120, opacity: 0, rotateX: -90 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
    exit: (i) => ({
      y: -60,
      opacity: 0,
      rotateX: 45,
      transition: {
        delay: i * 0.015,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const name = "Kelvin Fameyeh";

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          {/* Animated particles */}
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle absolute rounded-full bg-accent/40"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                }}
              />
            ))}
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201, 168, 124, 0.4) 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Accent line decorations */}
          <motion.div
            className="absolute top-0 left-20 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute top-0 right-20 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          />

          {/* Horizontal scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <div className="relative z-10 text-center px-6">
            {/* Small label */}
            <motion.p
              className="font-mono text-caption uppercase tracking-[0.4em] text-accent mb-10"
              initial={{ opacity: 0, y: 20, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.4em' }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              Welcome
            </motion.p>

            {/* Main name - letter by letter with 3D effect */}
            <div className="overflow-visible mb-8 perspective-1000">
              <h1 className="font-serif text-[clamp(2.5rem,10vw,7rem)] leading-[1.1] text-foreground flex flex-wrap justify-center gap-x-5">
                {name.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="flex overflow-visible">
                    {word.split('').map((letter, letterIndex) => (
                      <motion.span
                        key={letterIndex}
                        custom={wordIndex * 10 + letterIndex}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-block"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>

            {/* Animated word carousel with fade */}
            <div className="h-10 overflow-hidden mb-14">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentWord}
                  className="font-sans text-body-lg text-accent tracking-widest uppercase"
                  initial={{ y: 30, opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -30, opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {words[currentWord]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress indicator */}
            <div className="relative w-56 mx-auto">
              {/* Progress bar background */}
              <div className="h-px bg-foreground-muted/10 w-full rounded-full overflow-hidden">
                {/* Progress bar fill */}
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-accent/50 via-accent to-accent/50 w-0"
                  style={{ boxShadow: '0 0 20px rgba(201, 168, 124, 0.5)' }}
                />
              </div>

              {/* Progress number with glow */}
              <motion.div
                className="mt-6 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-mono text-caption text-foreground-muted tabular-nums">
                  {progress}%
                </span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>

          {/* Corner decorations with animation */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accent/50 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 w-16 h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-accent/50 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-accent/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-8 w-16 h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-accent/50 to-transparent" />
            <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-accent/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-accent/50 to-transparent" />
            <div className="absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-accent/50 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
