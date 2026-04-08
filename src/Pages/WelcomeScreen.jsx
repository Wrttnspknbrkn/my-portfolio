import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canSkip, setCanSkip] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const orbsRef = useRef([]);
  const linesRef = useRef([]);
  const particlesRef = useRef([]);

  // Create diverse tech particles on canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Particle types: dots, squares, triangles, plus signs, hollow circles
    const particleTypes = ['dot', 'square', 'triangle', 'plus', 'ring', 'diamond'];
    const particles = [];
    const particleCount = 50;

    // Create diverse particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 6 + 3,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    particlesRef.current = particles;

    // Draw different particle shapes
    const drawParticle = (p) => {
      const pulseScale = 1 + Math.sin(p.pulse) * 0.2;
      const size = p.size * pulseScale;
      const alpha = p.alpha + Math.sin(p.pulse) * 0.1;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgba(201, 168, 124, ${alpha})`;
      ctx.fillStyle = `rgba(201, 168, 124, ${alpha * 0.5})`;
      ctx.lineWidth = 1;

      switch (p.type) {
        case 'dot':
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.strokeRect(-size / 2, -size / 2, size, size);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.stroke();
          break;
        case 'plus':
          ctx.beginPath();
          ctx.moveTo(-size / 2, 0);
          ctx.lineTo(size / 2, 0);
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(0, size / 2);
          ctx.stroke();
          break;
        case 'ring':
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, 0);
          ctx.lineTo(0, size / 2);
          ctx.lineTo(-size / 2, 0);
          ctx.closePath();
          ctx.stroke();
          break;
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        // Subtle mouse influence
        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += dx * force * 0.0003;
          p.vy += dy * force * 0.0003;
        }

        // Update position (slower movement)
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.pulse += p.pulseSpeed;

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Boundary wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle
        drawParticle(p);

        // Draw subtle connections between nearby particles
        particles.forEach((other, j) => {
          if (i >= j) return;
          const d = Math.sqrt((p.x - other.x) ** 2 + (p.y - other.y) ** 2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(201, 168, 124, ${(1 - d / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos]);

  // GSAP Timeline for entrance animations
  useEffect(() => {
    const tl = gsap.timeline();

    // Animate orbs with elegant movement
    orbsRef.current.forEach((orb, i) => {
      if (!orb) return;
      gsap.set(orb, { scale: 0, opacity: 0 });
      
      tl.to(orb, {
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: 'power3.out',
        delay: i * 0.3,
      }, 0.5);

      // Gentle floating animation
      gsap.to(orb, {
        y: 'random(-20, 20)',
        x: 'random(-15, 15)',
        duration: 'random(5, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.5,
      });
    });

    // Animate vertical lines
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: i % 2 === 0 ? 'top' : 'bottom',
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.8 + i * 0.1,
      });
    });

    // Text reveal animation
    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char');
      gsap.from(chars, {
        y: 80,
        opacity: 0,
        rotationX: -60,
        stagger: 0.04,
        duration: 1.2,
        ease: 'back.out(1.5)',
        delay: 1.2,
      });
    }

    return () => tl.kill();
  }, []);

  // Progress animation - medium pace (7 seconds total)
  useEffect(() => {
    const duration = 7000;
    const start = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const prog = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(prog));
      
      if (prog >= 35 && !canSkip) {
        setCanSkip(true);
      }
      
      if (prog < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => onLoadingComplete?.(), 700);
        }, 400);
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
      setTimeout(() => onLoadingComplete?.(), 500);
    }
  }, [canSkip, onLoadingComplete]);

  const name = "Kelvin Fameyeh";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: 'blur(15px)',
          }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          onMouseMove={handleMouseMove}
          onClick={handleSkip}
        >
          {/* Tech particles canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 opacity-70"
          />

          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                ref={el => orbsRef.current[i] = el}
                className="absolute rounded-full blur-3xl"
                style={{
                  width: `${180 + i * 100}px`,
                  height: `${180 + i * 100}px`,
                  background: `radial-gradient(circle, rgba(201, 168, 124, ${0.12 - i * 0.02}) 0%, transparent 70%)`,
                  left: `${5 + i * 22}%`,
                  top: `${10 + (i % 2) * 35}%`,
                }}
              />
            ))}
          </div>

          {/* Vertical accent lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                ref={el => linesRef.current[i] = el}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${15 + i * 14}%`,
                  background: `linear-gradient(to ${i % 2 === 0 ? 'bottom' : 'top'}, transparent, rgba(201, 168, 124, 0.06) 30%, rgba(201, 168, 124, 0.1) 50%, rgba(201, 168, 124, 0.06) 70%, transparent)`,
                }}
              />
            ))}
          </div>

          {/* Scanning line effect */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201, 168, 124, 0.4), rgba(201, 168, 124, 0.6), rgba(201, 168, 124, 0.4), transparent)',
              boxShadow: '0 0 20px rgba(201, 168, 124, 0.3)',
            }}
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Corner accents */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-24 h-24 pointer-events-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 1 }}
            >
              <div 
                className={`absolute ${pos.includes('top') ? 'top-6' : 'bottom-6'} ${pos.includes('left') ? 'left-6' : 'right-6'} w-16 h-16`}
              >
                <div 
                  className={`absolute ${pos.includes('top') ? 'top-0' : 'bottom-0'} ${pos.includes('left') ? 'left-0' : 'right-0'} ${pos.includes('left') ? 'w-full bg-gradient-to-r' : 'w-full bg-gradient-to-l'} from-accent/40 to-transparent h-px`}
                />
                <div 
                  className={`absolute ${pos.includes('top') ? 'top-0' : 'bottom-0'} ${pos.includes('left') ? 'left-0' : 'right-0'} ${pos.includes('top') ? 'h-full bg-gradient-to-b' : 'h-full bg-gradient-to-t'} from-accent/40 to-transparent w-px`}
                />
              </div>
            </motion.div>
          ))}

          {/* Main content */}
          <div className="relative z-10 text-center px-6">
            {/* Subtle top label */}
            <motion.div
              className="mb-10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.span
                className="inline-block font-mono text-[10px] tracking-[0.5em] text-accent/70 uppercase"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, duration: 1, ease: [0.4, 0, 0.2, 1] }}
              >
                Portfolio
              </motion.span>
            </motion.div>

            {/* Main name with character animation */}
            <div ref={textRef} className="mb-12">
              <h1 className="font-serif text-[clamp(2.5rem,10vw,7rem)] leading-[1.1] tracking-tight text-foreground flex flex-wrap justify-center">
                {name.split('').map((char, i) => (
                  <span
                    key={i}
                    className="char inline-block"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      marginRight: char === ' ' ? '0.25em' : '0',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Role with subtle animation */}
            <motion.div
              className="h-6 mb-14 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <motion.p
                className="font-sans text-xs tracking-[0.4em] text-foreground-muted/70 uppercase"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Software Developer
              </motion.p>
            </motion.div>

            {/* Progress section */}
            <motion.div
              className="w-56 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              {/* Progress bar */}
              <div className="relative h-[1px] bg-foreground-muted/10 rounded-full overflow-hidden mb-8">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/60 via-accent to-accent/60"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 15px rgba(201, 168, 124, 0.5)',
                  }}
                  transition={{ duration: 0.1 }}
                />
                {/* Progress dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full"
                  style={{ 
                    left: `calc(${progress}% - 3px)`,
                    boxShadow: '0 0 10px rgba(201, 168, 124, 0.8)',
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              {/* Progress number */}
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl text-foreground/80 tabular-nums">
                  {progress}
                </span>
                <span className="font-mono text-xs text-foreground-muted/50">%</span>
              </div>

              {/* Skip hint */}
              <AnimatePresence>
                {canSkip && (
                  <motion.p
                    className="mt-8 font-mono text-[10px] text-accent/50 tracking-wider"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    TAP TO ENTER
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom year */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2.5, duration: 1.2 }}
          >
            <div className="w-6 h-px bg-accent/40" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-foreground-muted/60 uppercase">
              2025
            </span>
            <div className="w-6 h-px bg-accent/40" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
