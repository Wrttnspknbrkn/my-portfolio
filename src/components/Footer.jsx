import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, ArrowUpRight, Terminal, Code2, Cpu, Zap } from "lucide-react";
import gsap from "gsap";

// Floating tech icons
const TechOrbit = () => {
  const orbitRef = useRef(null);
  
  useEffect(() => {
    const icons = orbitRef.current?.querySelectorAll('.orbit-icon');
    if (icons) {
      icons.forEach((icon, i) => {
        gsap.to(icon, {
          rotation: 360,
          duration: 20 + i * 5,
          repeat: -1,
          ease: "none",
          transformOrigin: `${80 + i * 30}px center`,
        });
      });
    }
  }, []);
  
  return (
    <div ref={orbitRef} className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 hidden lg:block">
      <div className="orbit-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Terminal className="w-4 h-4 text-accent" />
      </div>
      <div className="orbit-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Code2 className="w-4 h-4 text-accent" />
      </div>
      <div className="orbit-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Cpu className="w-4 h-4 text-accent" />
      </div>
    </div>
  );
};

// Animated line
const AnimatedLine = ({ delay = 0 }) => {
  const lineRef = useRef(null);
  const isInView = useInView(lineRef, { once: true });
  
  return (
    <motion.div
      ref={lineRef}
      className="h-px bg-gradient-to-r from-transparent via-accent to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.4, 0, 0.2, 1] }}
    />
  );
};

// Social link
const SocialLink = ({ icon: Icon, href, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative p-3 text-foreground-muted hover:text-accent transition-colors duration-300"
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
  >
    <Icon className="w-5 h-5" strokeWidth={1.5} />
    <motion.span 
      className="absolute inset-0 bg-accent/5 rounded-full"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.5, opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  </motion.a>
);

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Github, href: "https://github.com/Wrttnspknbrkn", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/kelvin-fameyeh-9479941a9/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/kelvin.exe__", label: "Instagram" },
    { icon: Mail, href: "mailto:wycekhid10@gmail.com", label: "Email" },
  ];

  const navLinks = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portofolio", label: "Work" },
    { href: "#Contact", label: "Contact" },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer ref={footerRef} className="relative bg-background-secondary overflow-hidden">
      {/* Top accent line */}
      <AnimatedLine />
      
      {/* Decorative elements */}
      <TechOrbit />
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(201, 168, 124, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201, 168, 124, 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 md:py-24">
          <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-12 lg:gap-8">
            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <span className="font-serif text-2xl text-foreground">Kelvin</span>
                <span className="font-serif text-2xl text-accent">Fameyeh</span>
              </div>
              
              {/* Tagline with code aesthetic */}
              <div className="mb-8 p-4 bg-background/50 border border-border rounded-lg max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="font-mono text-micro text-foreground-muted">terminal</span>
                </div>
                <code className="font-mono text-sm text-foreground-muted">
                  <span className="text-accent">const</span> developer = {"{"}
                  <br />
                  <span className="ml-4">passion: <span className="text-green-400">&quot;building digital experiences&quot;</span>,</span>
                  <br />
                  <span className="ml-4">status: <span className="text-green-400">&quot;available&quot;</span></span>
                  <br />
                  {"}"};
                </code>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-1">
                {socialLinks.map((social) => (
                  <SocialLink key={social.label} {...social} />
                ))}
              </div>
            </motion.div>

            {/* Navigation column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-mono text-caption uppercase tracking-wider text-foreground-muted mb-6">
                Navigation
              </h3>
              <nav className="space-y-3">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <span className="font-mono text-micro text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      {">"}
                    </span>
                    <span className="font-sans text-body-sm">{link.label}</span>
                  </motion.a>
                ))}
              </nav>
            </motion.div>

            {/* Contact column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-mono text-caption uppercase tracking-wider text-foreground-muted mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:wycekhid10@gmail.com"
                  className="group flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors duration-300"
                >
                  <span className="font-sans text-body-sm">wycekhid10@gmail.com</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="font-sans text-body-sm text-foreground-muted">
                  Accra, Ghana
                </p>
                
                {/* CTA */}
                <motion.a
                  href="#Contact"
                  onClick={(e) => scrollToSection(e, "#Contact")}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap className="w-4 h-4" />
                  <span className="font-sans text-body-sm">Start a Project</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.p
              className="font-mono text-micro text-foreground-muted text-center sm:text-left"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {currentYear} Kelvin Fameyeh. All rights reserved.
            </motion.p>

            {/* Tech stack badge */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-border rounded-full"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-micro text-foreground-muted">
                Built with React + Tailwind
              </span>
            </motion.div>

            {/* Scroll to top */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-mono text-micro text-foreground-muted hover:text-accent transition-colors duration-300 flex items-center gap-1"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span>Back to top</span>
              <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
