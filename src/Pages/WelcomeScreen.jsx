import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canSkip, setCanSkip] = useState(false);
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const textRef = useRef(null);
  const orbsRef = useRef([]);
  const linesRef = useRef([]);
  const nodesRef = useRef([]);

  // Create animated tech grid
  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gridRef.current.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    gridRef.current.width = width;
    gridRef.current.height = height;

    const nodes = [];
    const nodeCount = 40;
    const connections = [];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Mouse influence
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          node.vx += dx * force * 0.001;
          node.vy += dy * force * 0.001;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        // Boundary check
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node with pulse
        const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 124, ${0.4 + Math.sin(node.pulse) * 0.2})`;
        ctx.fill();

        // Draw connections
        nodes.forEach((other, j) => {
          if (i === j) return;
          const d = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(201, 168, 124, ${(1 - d / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      gridRef.current.width = window.innerWidth;
      gridRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos]);

  // GSAP Timeline for entrance
  useEffect(() => {
    const tl = gsap.timeline();

    // Animate orbs with complex movement
    orbsRef.current.forEach((orb, i) => {
      if (!orb) return;
      gsap.set(orb, { 
        scale: 0, 
        opacity: 0,
        rotation: Math.random() * 360 
      });
      
      tl.to(orb, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        delay: i * 0.2,
      }, 0.3);

      // Continuous floating animation
      gsap.to(orb, {
        y: 'random(-30, 30)',
        x: 'random(-20, 20)',
        rotation: '+=random(-15, 15)',
        duration: 'random(4, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });
    });

    // Animate lines
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: i % 2 === 0 ? 'top' : 'bottom',
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.5 + i * 0.15,
      });
    });

    // Text reveal animation
    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char');
      gsap.from(chars, {
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.03,
        duration: 1,
        ease: 'back.out(1.7)',
        delay: 0.8,
      });
    }

    return () => tl.kill();
  }, []);

  // Progress animation
  useEffect(() => {
    const duration = 5000;
    const start = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const prog = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(prog));
      
      if (prog >= 40 && !canSkip) {
        setCanSkip(true);
      }
      
      if (prog < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => onLoadingComplete?.(), 600);
        }, 300);
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, [onLoadingComplete, canSkip]);

  // Mouse tracking
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Skip function
  const handleSkip = useCallback(() => {
    if (canSkip) {
      setIsLoading(false);
      setTimeout(() => onLoadingComplete?.(), 400);
    }
  }, [canSkip, onLoadingComplete]);

  const name = "Kelvin Fameyeh";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          onMouseMove={handleMouseMove}
          onClick={handleSkip}
        >
          {/* Tech grid canvas */}
          <canvas
            ref={gridRef}
            className="absolute inset-0 opacity-60"
          />

          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                ref={el => orbsRef.current[i] = el}
                className="absolute rounded-full blur-3xl"
                style={{
                  width: `${150 + i * 80}px`,
                  height: `${150 + i * 80}px`,
                  background: `radial-gradient(circle, rgba(201, 168, 124, ${0.15 - i * 0.02}) 0%, transparent 70%)`,
                  left: `${10 + i * 18}%`,
                  top: `${15 + (i % 3) * 25}%`,
                }}
              />
            ))}
          </div>

          {/* Vertical animated lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                ref={el => linesRef.current[i] = el}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${12 + i * 11}%`,
                  background: `linear-gradient(to ${i % 2 === 0 ? 'bottom' : 'top'}, transparent, rgba(201, 168, 124, 0.08) 30%, rgba(201, 168, 124, 0.15) 50%, rgba(201, 168, 124, 0.08) 70%, transparent)`,
                }}
              />
            ))}
          </div>

          {/* Horizontal scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201, 168, 124, 0.6), rgba(201, 168, 124, 0.8), rgba(201, 168, 124, 0.6), transparent)',
              boxShadow: '0 0 30px rgba(201, 168, 124, 0.5)',
            }}
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Glowing corner accents */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-32 h-32 pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
            >
              <div 
                className={`absolute ${pos.includes('top') ? 'top-8' : 'bottom-8'} ${pos.includes('left') ? 'left-8' : 'right-8'} w-20 h-20`}
              >
                <div 
                  className={`absolute ${pos.includes('top') ? 'top-0' : 'bottom-0'} ${pos.includes('left') ? 'left-0' : 'right-0'} ${pos.includes('left') ? 'w-full bg-gradient-to-r' : 'w-full bg-gradient-to-l'} from-accent/60 to-transparent h-px`}
                />
                <div 
                  className={`absolute ${pos.includes('top') ? 'top-0' : 'bottom-0'} ${pos.includes('left') ? 'left-0' : 'right-0'} ${pos.includes('top') ? 'h-full bg-gradient-to-b' : 'h-full bg-gradient-to-t'} from-accent/60 to-transparent w-px`}
                />
              </div>
            </motion.div>
          ))}

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Subtitle */}
            <motion.div
              className="mb-8 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.span
                className="inline-block font-mono text-xs tracking-[0.5em] text-accent uppercase"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                Portfolio
              </motion.span>
            </motion.div>

            {/* Main name with character animation */}
            <div ref={textRef} className="mb-10">
              <h1 className="font-serif text-[clamp(2.8rem,11vw,8rem)] leading-[1] tracking-tight text-foreground flex flex-wrap justify-center">
                {name.split('').map((char, i) => (
                  <span
                    key={i}
                    className="char inline-block"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      marginRight: char === ' ' ? '0.3em' : '0',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Role text with typewriter effect */}
            <motion.div
              className="h-8 mb-12 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <motion.p
                className="font-sans text-sm tracking-[0.3em] text-foreground-muted uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Software Developer
              </motion.p>
            </motion.div>

            {/* Progress section */}
            <motion.div
              className="w-64 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {/* Progress bar container */}
              <div className="relative h-[2px] bg-foreground-muted/10 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/80 via-accent to-accent/80"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 20px rgba(201, 168, 124, 0.6)',
                  }}
                  transition={{ duration: 0.1 }}
                />
                {/* Glowing dot at progress end */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"
                  style={{ 
                    left: `${progress}%`,
                    boxShadow: '0 0 15px rgba(201, 168, 124, 0.8)',
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>

              {/* Progress number */}
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl text-foreground tabular-nums">
                  {progress}
                </span>
                <span className="font-mono text-xs text-foreground-muted">%</span>
              </div>

              {/* Skip hint */}
              <AnimatePresence>
                {canSkip && (
                  <motion.p
                    className="mt-6 font-mono text-xs text-accent/60 cursor-pointer hover:text-accent transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Click anywhere to enter
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom decoration */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="w-8 h-px bg-accent/50" />
            <span className="font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
              2025
            </span>
            <div className="w-8 h-px bg-accent/50" />
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-accent/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
