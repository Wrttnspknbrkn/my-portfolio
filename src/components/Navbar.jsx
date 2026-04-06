import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navRef = useRef(null);

  const navItems = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portofolio", label: "Work" },
    { href: "#Contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navItems
        .map((item) => {
          const section = document.querySelector(item.href);
          if (section) {
            return {
              id: item.href.replace("#", ""),
              offset: section.offsetTop - 150,
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

    window.addEventListener("scroll", handleScroll);
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
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
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
            ? "bg-background/90 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#Home"
              onClick={(e) => scrollToSection(e, "#Home")}
              className="relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-serif text-xl tracking-tight text-foreground">
                Kelvin
              </span>
              <span className="font-serif text-xl tracking-tight text-accent ml-1">
                .
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-accent"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="relative px-5 py-2"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Hover background */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.span
                        className="absolute inset-0 bg-accent/5 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        layoutId="navHover"
                      />
                    )}
                  </AnimatePresence>

                  <span
                    className={`relative z-10 font-sans text-body-sm tracking-wide transition-colors duration-300 ${
                      activeSection === item.href.substring(1)
                        ? "text-accent"
                        : "text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {activeSection === item.href.substring(1) && (
                    <motion.span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider">
                Available for work
              </span>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="w-full h-px bg-foreground origin-center"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-px bg-foreground"
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? -20 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-px bg-foreground origin-center"
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
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
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center px-8">
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="block py-4 border-b border-border"
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
                      <span className="font-sans text-caption text-foreground-muted">
                        0{index + 1}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </nav>

              {/* Mobile status */}
              <motion.div
                className="absolute bottom-12 left-8 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider">
                  Available for work
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
