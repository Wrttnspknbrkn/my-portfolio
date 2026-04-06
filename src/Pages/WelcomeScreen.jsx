import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

// Interactive cursor follower component
const CursorFollower = ({ mousePos, isHovering }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePos.x - 20,
        y: mousePos.y - 20,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <div className="w-10 h-10 rounded-full border border-accent/60 flex items-center justify-center">
        <motion.div 
          className="w-2 h-2 rounded-full bg-accent"
          animate={{ scale: isHovering ? 0 : 1 }}
        />
      </div>
    </motion.div>
  );
};

// Floating interactive element
const FloatingElement = ({ children, delay = 0, onClick, isActive }) => {
  return (
    <motion.div
      className={`cursor-pointer select-none transition-colors duration-300 ${isActive ? 'text-accent' : 'text-foreground-muted/40 hover:text-foreground-muted'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{ delay, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [activeElements, setActiveElements] = useState([]);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const particlesRef = useRef(null);

  const words = ['Create', 'Design', 'Develop', 'Inspire'];
  const interactiveElements = ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Firebase'];

  // Track mouse position
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle element click
  const handleElementClick = useCallback((index) => {
    setActiveElements(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
    setClickCount(prev => prev + 1);
    setShowHint(false);
  }, []);

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
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    // Animate progress bar with GSAP
    gsap.to(progressBarRef.current, {
      width: '100%',
      duration: 4.5,
      ease: 'power2.inOut',
      onUpdate: function() {
        const prog = Math.round(this.progress() * 100);
        setProgress(prog);
      }
    });

    // Cycle through words - readable pace
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1000);

    // Complete loading after animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 800);
    }, 5000);

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
          className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center overflow-hidden cursor-none"
          initial={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
          onMouseEnter={() => setIsHovering(false)}
        >
          {/* Custom cursor */}
          <CursorFollower mousePos={mousePos} isHovering={isHovering} />

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

          {/* Interactive floating tech stack elements */}
          <div className="absolute inset-0 pointer-events-none">
            {interactiveElements.map((tech, i) => {
              const positions = [
                { top: '15%', left: '10%' },
                { top: '20%', right: '15%' },
                { top: '45%', left: '5%' },
                { top: '50%', right: '8%' },
                { bottom: '25%', left: '12%' },
                { bottom: '20%', right: '10%' },
              ];
              return (
                <motion.div
                  key={tech}
                  className="absolute pointer-events-auto hidden sm:block"
                  style={positions[i]}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <FloatingElement
                    delay={0.8 + i * 0.15}
                    onClick={() => handleElementClick(i)}
                    isActive={activeElements.includes(i)}
                  >
                    <span className="font-mono text-body-sm sm:text-body tracking-wide">
                      {tech}
                    </span>
                  </FloatingElement>
                </motion.div>
              );
            })}
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
              x: mousePos.x * 0.02 - 20,
              y: mousePos.y * 0.02 - 20,
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
              x: -mousePos.x * 0.015 + 15,
              y: -mousePos.y * 0.015 + 15,
            }}
            transition={{
              scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 0.5 },
              y: { duration: 0.5 },
            }}
          />

          {/* Accent line decorations */}
          <motion.div
            className="absolute top-0 left-10 sm:left-20 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.div
            className="absolute top-0 right-10 sm:right-20 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent"
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

          <div className="relative z-10 text-center px-4 sm:px-6">
            {/* Small label */}
            <motion.p
              className="font-mono text-micro sm:text-caption uppercase tracking-[0.3em] sm:tracking-[0.4em] text-accent mb-6 sm:mb-10"
              initial={{ opacity: 0, y: 20, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.4em' }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              Welcome
            </motion.p>

            {/* Main name - letter by letter with 3D effect */}
            <div 
              className="overflow-visible mb-6 sm:mb-8 perspective-1000"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <h1 className="font-serif text-[clamp(2rem,9vw,7rem)] leading-[1.1] text-foreground flex flex-wrap justify-center gap-x-3 sm:gap-x-5">
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
                        className="inline-block hover:text-accent transition-colors duration-200"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>

            {/* Animated word carousel */}
            <div className="h-8 sm:h-10 overflow-hidden mb-8 sm:mb-14">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentWord}
                  className="font-sans text-body sm:text-body-lg text-accent tracking-widest uppercase"
                  initial={{ y: 30, opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -30, opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {words[currentWord]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Interactive hint - desktop only */}
            <AnimatePresence>
              {showHint && (
                <motion.p
                  className="hidden sm:block font-mono text-micro text-foreground-muted/50 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  Click the floating tech stack to interact
                </motion.p>
              )}
            </AnimatePresence>

            {/* Click counter feedback */}
            <AnimatePresence>
              {clickCount > 0 && (
                <motion.div
                  className="hidden sm:block absolute top-4 right-4 sm:top-8 sm:right-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="font-mono text-micro text-accent">
                    {clickCount} / {interactiveElements.length} discovered
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress indicator */}
            <div className="relative w-48 sm:w-56 mx-auto">
              {/* Progress bar background */}
              <div className="h-px bg-foreground-muted/10 w-full rounded-full overflow-hidden">
                {/* Progress bar fill */}
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-accent/50 via-accent to-accent/50 w-0"
                  style={{ boxShadow: '0 0 20px rgba(201, 168, 124, 0.5)' }}
                />
              </div>

              {/* Progress number */}
              <motion.div
                className="mt-4 sm:mt-6 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-mono text-micro sm:text-caption text-foreground-muted tabular-nums">
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

          {/* Corner decorations */}
          <motion.div
            className="absolute top-4 left-4 sm:top-8 sm:left-8 w-12 sm:w-16 h-12 sm:h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-accent/50 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 sm:w-16 h-12 sm:h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-accent/50 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-accent/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 sm:w-16 h-12 sm:h-16"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-accent/50 to-transparent" />
            <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-accent/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 sm:w-16 h-12 sm:h-16"
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
