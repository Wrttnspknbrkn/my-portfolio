import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const location = useLocation();
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  const navItems = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portofolio", label: "Work" },
    { href: "#Contact", label: "Contact" },
  ];

  // Smart hide/show on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
    lastScrollY.current = latest;
  });

  // GSAP logo animation
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: section.offsetTop - 200,
              height: section.offsetHeight,
            };
          }
          return null;
        })
        .filter(Boolean);

      const currentPosition = window.scrollY;
      const active = sections.find(
        (section) =>
          currentPosition >= section.offset &&
          currentPosition < section.offset + section.height
      );

      if (active) {
        setActiveSection(active.id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    
    // If we're on a project page, navigate home first
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    
    const section = document.querySelector(href);
    if (section) {
      const top = section.offsetTop - 100;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const itemVariants = {
    closed: { x: -40, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const lineVariants = {
    closed: { scaleX: 0 },
    open: (i) => ({
      scaleX: 1,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo - Full Name */}
            <motion.div ref={logoRef}>
              {location.pathname === "/" ? (
                <a
                  href="#Home"
                  onClick={(e) => scrollToSection(e, "#Home")}
                  className="group relative flex items-center gap-2"
                >
                  <span className="font-serif text-lg sm:text-xl tracking-tight text-foreground">
                    Kelvin
                  </span>
                  <span className="font-serif text-lg sm:text-xl tracking-tight text-accent">
                    Fameyeh
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-px bg-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  />
                </a>
              ) : (
                <Link to="/" className="group relative flex items-center gap-2">
                  <span className="font-serif text-lg sm:text-xl tracking-tight text-foreground">
                    Kelvin
                  </span>
                  <span className="font-serif text-lg sm:text-xl tracking-tight text-accent">
                    Fameyeh
                  </span>
                </Link>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="relative px-5 py-2.5 group"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {/* Hover background */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.span
                        className="absolute inset-0 bg-accent/5 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25 }}
                        layoutId="navHover"
                      />
                    )}
                  </AnimatePresence>

                  <span
                    className={`relative z-10 font-sans text-body-sm tracking-wide transition-colors duration-300 ${
                      activeSection === item.href.substring(1)
                        ? "text-accent"
                        : "text-foreground-muted group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {activeSection === item.href.substring(1) && (
                    <motion.span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Status indicator & CV Link */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/cv"
                className="font-sans text-caption text-foreground-muted hover:text-accent transition-colors duration-300 uppercase tracking-wider"
              >
                Resume
              </Link>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="font-mono text-micro text-foreground-muted uppercase">
                  Available
                </span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-12 h-12 flex items-center justify-center -mr-2"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.92 }}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-[1.5px] bg-foreground origin-center"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 9.5 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                />
                <motion.span
                  className="w-full h-[1.5px] bg-foreground"
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? -20 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                />
                <motion.span
                  className="w-full h-[1.5px] bg-foreground origin-center"
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -9.5 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/98 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center px-8">
              {/* Navigation links */}
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.label} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className="block py-4"
                      custom={index}
                      variants={itemVariants}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-serif text-display-sm ${
                            activeSection === item.href.substring(1)
                              ? "text-accent"
                              : "text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="font-mono text-caption text-foreground-muted">
                          0{index + 1}
                        </span>
                      </div>
                    </motion.a>
                    <motion.div
                      className="h-px bg-border origin-left"
                      custom={index}
                      variants={lineVariants}
                    />
                  </div>
                ))}
                
                {/* CV Link in mobile menu */}
                <div className="overflow-hidden pt-4">
                  <motion.div custom={navItems.length} variants={itemVariants}>
                    <Link
                      to="/cv"
                      onClick={() => setIsOpen(false)}
                      className="block py-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-display-sm text-foreground-muted">
                          Resume
                        </span>
                        <span className="font-mono text-caption text-foreground-muted">
                          CV
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </nav>

              {/* Mobile status & socials */}
              <motion.div
                className="absolute bottom-16 left-8 right-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                    </span>
                    <span className="font-mono text-micro text-foreground-muted uppercase">
                      Available for work
                    </span>
                  </div>
                  <span className="font-mono text-micro text-foreground-muted">
                    2025
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
