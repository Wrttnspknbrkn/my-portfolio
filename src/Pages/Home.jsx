import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Github, Linkedin, Instagram, Mail, Sparkles } from "lucide-react";
import gsap from "gsap";

// Floating particles component
const FloatingParticles = memo(() => {
  const particles = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

// Animated grid background
const AnimatedGrid = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201, 168, 124, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 168, 124, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Animated scan line */}
      <motion.div
        className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
});

// Glowing orb component
const GlowingOrb = memo(({ className, delay = 0 }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
});

// Magnetic button wrapper
const MagneticWrapper = memo(({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
});

// Animated character component
const AnimatedChar = memo(({ char, index, totalChars }) => {
  return (
    <motion.span
      className="inline-block"
      initial={{ y: 100, opacity: 0, rotateX: -90 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5 + index * 0.05,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
});

// Social link component with glow
const SocialLink = memo(({ icon: Icon, href, label, index }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative p-4 border border-border hover:border-accent/50 transition-all duration-500"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    <motion.div
      className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />
    <Icon className="w-5 h-5 relative z-10 text-foreground-muted group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
  </motion.a>
));

// Typing effect hook
const useTypingEffect = (words, typingSpeed = 80, erasingSpeed = 40, pauseDuration = 2500) => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (isTyping) {
          if (charIndex < words[wordIndex].length) {
            setText((prev) => prev + words[wordIndex][charIndex]);
            setCharIndex((prev) => prev + 1);
          } else {
            setTimeout(() => setIsTyping(false), pauseDuration);
          }
        } else {
          if (charIndex > 0) {
            setText((prev) => prev.slice(0, -1));
            setCharIndex((prev) => prev - 1);
          } else {
            setWordIndex((prev) => (prev + 1) % words.length);
            setIsTyping(true);
          }
        }
      },
      isTyping ? typingSpeed : erasingSpeed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, wordIndex, words, typingSpeed, erasingSpeed, pauseDuration]);

  return text;
};

// Constants
const WORDS = ["Software Developer", "Problem Solver", "Creative Thinker", "Tech Enthusiast"];
const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/Wrttnspknbrkn", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/kelvin-fameyeh-9479941a9/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/kelvin.exe__", label: "Instagram" },
];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const typedText = useTypingEffect(WORDS);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    setIsLoaded(true);
    
    // GSAP animation for hero elements
    if (heroRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      
      tl.fromTo(
        heroRef.current.querySelectorAll('.gsap-reveal'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.querySelector("#About");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const firstName = "Kelvin";
  const lastName = "Fameyeh";

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-24 md:pt-28"
      id="Home"
    >
      {/* Background elements */}
      <AnimatedGrid />
      <FloatingParticles />
      
      {/* Glowing orbs */}
      <GlowingOrb className="w-[600px] h-[600px] bg-accent/20 top-[-200px] left-[-200px]" delay={0} />
      <GlowingOrb className="w-[500px] h-[500px] bg-accent/15 bottom-[-150px] right-[-150px]" delay={2} />
      <GlowingOrb className="w-[300px] h-[300px] bg-accent/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={4} />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l border-t border-accent/20" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r border-t border-accent/20" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l border-b border-accent/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r border-b border-accent/20" />

      {/* Main content */}
      <motion.div
        ref={heroRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8"
        style={{ opacity, y, scale }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <motion.div
            className="mb-10 gsap-reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background-secondary/50 backdrop-blur-sm border border-border rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="font-sans text-caption uppercase tracking-[0.2em] text-foreground-muted">
                Available for new projects
              </span>
            </div>
          </motion.div>

          {/* Main heading with character animation */}
          <div className="mb-8 overflow-visible pb-4">
            <h1 className="font-serif text-[clamp(2.5rem,10vw,8rem)] leading-[1.1] tracking-tight text-foreground">
              <div className="overflow-visible">
                {firstName.split("").map((char, i) => (
                  <AnimatedChar key={i} char={char} index={i} totalChars={firstName.length} />
                ))}
              </div>
              <div className="overflow-visible">
                {lastName.split("").map((char, i) => (
                  <AnimatedChar 
                    key={i} 
                    char={char} 
                    index={i + firstName.length} 
                    totalChars={lastName.length} 
                  />
                ))}
              </div>
            </h1>
          </div>

          {/* Decorative line */}
          <motion.div
            className="w-24 h-px bg-accent mb-8"
            initial={{ scaleX: 0 }}
            animate={isLoaded ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 1, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Typing effect role */}
          <motion.div
            className="h-10 mb-6 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-mono text-body-lg text-accent tracking-wider">
              {typedText}
              <motion.span
                className="inline-block w-0.5 h-5 bg-accent ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </span>
            <Sparkles className="w-4 h-4 text-accent" />
          </motion.div>

          {/* Description */}
          <motion.p
            className="font-sans text-body-lg text-foreground-muted max-w-2xl mb-12 leading-relaxed gsap-reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Crafting elegant digital experiences through clean code and thoughtful design. 
            Specializing in full-stack development, creating scalable solutions, and 
            building user-centric applications that make an impact.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <MagneticWrapper>
              <a href="#Portofolio">
                <motion.button
                  className="group relative overflow-hidden px-10 py-5 bg-accent text-background font-sans text-body-sm uppercase tracking-[0.2em] font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Explore My Work
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-accent-dark"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>
              </a>
            </MagneticWrapper>
            
            <a href="#Contact">
              <motion.button
                className="group flex items-center gap-3 px-8 py-5 border border-border hover:border-accent text-foreground-muted hover:text-accent transition-all duration-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-4 h-4" />
                <span className="font-sans text-body-sm uppercase tracking-[0.15em]">Get In Touch</span>
              </motion.button>
            </a>
          </motion.div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social, index) => (
              <SocialLink key={social.label} {...social} index={index} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator - centered */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 md:bottom-12 left-0 right-0 mx-auto w-max flex flex-col items-center gap-3 text-foreground-muted hover:text-accent transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <span className="font-mono text-caption uppercase tracking-[0.2em]">
          Scroll to explore
        </span>
        <motion.div
          className="w-6 h-10 border border-border rounded-full flex justify-center pt-2"
        >
          <motion.div
            className="w-1 h-2 bg-accent rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.button>

      {/* Side decorations */}
      <motion.div
        className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-accent to-transparent" />
        <span className="font-mono text-caption text-foreground-muted/50 tracking-wider" style={{ writingMode: 'vertical-rl' }}>
          CRAFTING DIGITAL
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-accent via-accent to-transparent" />
      </motion.div>

      <motion.div
        className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-accent to-transparent" />
        <span className="font-mono text-caption text-foreground-muted/50 tracking-wider" style={{ writingMode: 'vertical-rl' }}>
          HAMBURG, GERMANY
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-accent via-accent to-transparent" />
      </motion.div>
    </section>
  );
};

export default memo(Home);
