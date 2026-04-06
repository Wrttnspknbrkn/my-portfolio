import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDown, Github, Linkedin, Instagram, Mail } from "lucide-react";

// Animated text reveal component
const AnimatedText = memo(({ text, className, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {text}
      </motion.span>
    </span>
  );
});

// Social link component
const SocialLink = memo(({ icon: Icon, href, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative p-3 text-foreground-muted hover:text-accent transition-colors duration-300"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    <Icon className="w-5 h-5" strokeWidth={1.5} />
    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
  </motion.a>
));

// Typing effect hook
const useTypingEffect = (words, typingSpeed = 100, erasingSpeed = 50, pauseDuration = 2000) => {
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
  const typedText = useTypingEffect(WORDS);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.querySelector("#About");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      id="Home"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(201, 168, 124, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201, 168, 124, 0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Accent gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8"
        style={{ opacity }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Small label */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-sans text-caption uppercase tracking-wider text-foreground-muted">
                Open to opportunities
              </span>
            </span>
          </motion.div>

          {/* Main heading */}
          <div className="mb-6">
            <h1 className="font-serif text-display-lg text-foreground leading-none">
              <div className="overflow-hidden">
                <AnimatedText text="Kelvin" delay={0.3} />
              </div>
              <div className="overflow-hidden">
                <AnimatedText
                  text="Fameyeh"
                  className="text-accent"
                  delay={0.4}
                />
              </div>
            </h1>
          </div>

          {/* Typing effect role */}
          <motion.div
            className="h-8 mb-8"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="font-sans text-body-lg text-foreground-muted">
              {typedText}
              <span className="ml-0.5 animate-pulse text-accent">|</span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="font-sans text-body text-foreground-muted max-w-xl mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Crafting elegant digital experiences through clean code and
            thoughtful design. Specializing in web development, backend
            engineering, and creating user-centric applications.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <a href="#Portofolio">
              <motion.button
                className="btn-primary min-w-[180px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Work</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>
            </a>
            <a href="#Contact">
              <motion.button
                className="font-sans text-body-sm text-foreground-muted hover:text-foreground transition-colors duration-300 flex items-center gap-2"
                whileHover={{ x: 4 }}
              >
                <Mail className="w-4 h-4" />
                <span>Get in touch</span>
              </motion.button>
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            {SOCIAL_LINKS.map((social) => (
              <SocialLink key={social.label} {...social} />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground-muted hover:text-accent transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.6 }}
        whileHover={{ y: 4 }}
      >
        <span className="font-sans text-caption uppercase tracking-wider">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
        </motion.div>
      </motion.button>

      {/* Side text decoration */}
      <motion.div
        className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <span className="font-sans text-caption uppercase tracking-[0.3em] text-foreground-muted/50">
          Portfolio 2024
        </span>
      </motion.div>

      <motion.div
        className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-center"
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <span className="font-sans text-caption uppercase tracking-[0.3em] text-foreground-muted/50">
          Based in Ghana
        </span>
      </motion.div>
    </section>
  );
};

export default memo(Home);
