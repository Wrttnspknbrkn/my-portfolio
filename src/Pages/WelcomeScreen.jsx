import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const orbsRef = useRef([]);
  const linesRef = useRef([]);
  const particlesRef = useRef([]);

  // Create unique tech-themed canvas animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let animationId;
    let mouseX = width / 2;
    let mouseY = height / 2;

    // Create circuit-like nodes and connections
    const nodes = [];
    const nodeCount = 35;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size: Math.random() * 4 + 2,
        type: ['node', 'pulse', 'hex', 'bracket'][Math.floor(Math.random() * 4)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.005,
        orbitRadius: Math.random() * 30 + 10,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    // Draw unique shapes
    const drawNode = (node, time) => {
      const pulse = Math.sin(time * node.speed + node.phase);
      const size = node.size * (1 + pulse * 0.3);
      const alpha = node.alpha * (0.7 + pulse * 0.3);

      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.globalAlpha = alpha;
      
      switch (node.type) {
        case 'node':
          // Glowing dot with ring
          ctx.fillStyle = `rgba(201, 168, 124, ${alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(201, 168, 124, ${alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'pulse':
          // Pulsing ring
          ctx.strokeStyle = `rgba(201, 168, 124, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, size * (1.5 + pulse), 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'hex':
          // Small hexagon
          ctx.strokeStyle = `rgba(201, 168, 124, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = Math.cos(angle) * size * 1.5;
            const y = Math.sin(angle) * size * 1.5;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          break;
        case 'bracket':
          // Code brackets < >
          ctx.strokeStyle = `rgba(201, 168, 124, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-size, -size);
          ctx.lineTo(-size * 2, 0);
          ctx.lineTo(-size, size);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(size, -size);
          ctx.lineTo(size * 2, 0);
          ctx.lineTo(size, size);
          ctx.stroke();
          break;
      }
      ctx.restore();
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw gradient background glow in center
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
      gradient.addColorStop(0, 'rgba(201, 168, 124, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Gentle orbital movement
        const orbitAngle = time * 0.0003 + node.phase;
        node.x = node.baseX + Math.cos(orbitAngle) * node.orbitRadius;
        node.y = node.baseY + Math.sin(orbitAngle) * node.orbitRadius;

        // Subtle mouse influence
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.3;
          node.x += dx * force * 0.02;
          node.y += dy * force * 0.02;
        }

        drawNode(node, time * 0.001);

        // Draw connections to nearby nodes
        nodes.forEach((other, j) => {
          if (i >= j) return;
          const d = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
          if (d < 120) {
            const lineAlpha = (1 - d / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(201, 168, 124, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Draw small dot at midpoint of some connections
            if (d < 80 && Math.random() > 0.95) {
              ctx.fillStyle = `rgba(201, 168, 124, ${lineAlpha * 2})`;
              ctx.beginPath();
              ctx.arc((node.x + other.x) / 2, (node.y + other.y) / 2, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency - runs once

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

  // Progress animation - medium pace (7 seconds total) - runs only once
  useEffect(() => {
    const duration = 7000;
    const start = Date.now();
    let hasSetCanSkip = false;
    let animationId;
    
    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const prog = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(prog));
      
      if (prog >= 35 && !hasSetCanSkip) {
        hasSetCanSkip = true;
        setCanSkip(true);
      }
      
      if (prog < 100) {
        animationId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => onLoadingComplete?.(), 700);
        }, 400);
      }
    };
    
    animationId = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []); // Empty dependency - runs only once on mount

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
