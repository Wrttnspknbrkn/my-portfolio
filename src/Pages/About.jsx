import React, { useRef, useMemo, memo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FileText, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

// Animated counter component
const AnimatedCounter = memo(({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        {isInView ? value : 0}
        {suffix}
      </motion.span>
    </span>
  );
});

// Stat card component
const StatCard = memo(({ number, label, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group relative p-8 border-b border-r border-border last:border-r-0 hover:bg-accent/5 transition-colors duration-500"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="flex flex-col">
        <span className="font-serif text-display text-accent mb-2">
          <AnimatedCounter value={number} suffix="+" />
        </span>
        <span className="font-sans text-body-sm text-foreground-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
});

// Image with reveal effect
const RevealImage = memo(({ src, alt }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-background z-10"
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : {}}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        style={{ transformOrigin: "right" }}
      />
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.2 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />
    </div>
  );
});

const AboutPage = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, margin: "-100px" });
  const { totalProjects, totalCertificates } = usePortfolio();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Calculate years of experience
  const yearsExperience = useMemo(() => {
    const startDate = new Date("2021-09-06");
    const today = new Date();
    return (
      today.getFullYear() -
      startDate.getFullYear() -
      (today <
      new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate())
        ? 1
        : 0)
    );
  }, []);

  const stats = useMemo(
    () => [
      { number: totalProjects, label: "Projects Completed" },
      { number: yearsExperience, label: "Years Experience" },
      { number: totalCertificates, label: "Certifications" },
    ],
    [totalProjects, yearsExperience, totalCertificates]
  );

  const skills = [
    "React",
    "JavaScript",
    "Node.js",
    "PHP",
    "Python",
    "Tailwind CSS",
    "Firebase",
    "MySQL",
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-section bg-background overflow-hidden"
      id="About"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/[0.02]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-20">
          <motion.span
            className="font-sans text-caption uppercase tracking-[0.3em] text-accent block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            About
          </motion.span>
          <motion.div
            className="w-12 h-px bg-accent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column - Image */}
          <motion.div className="relative" style={{ y: imageY }}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <RevealImage src="/profile.jpeg" alt="Kelvin Fameyeh" />

              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l border-t border-accent/30" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-accent/30" />
            </div>

            {/* Floating label */}
            <motion.div
              className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-background px-6 py-4 border border-border"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <span className="font-serif text-display-sm text-accent">
                {yearsExperience}+
              </span>
              <span className="block font-sans text-caption text-foreground-muted uppercase tracking-wider mt-1">
                Years of
                <br />
                Experience
              </span>
            </motion.div>
          </motion.div>

          {/* Right column - Content */}
          <div ref={textRef} className="lg:pt-12">
            <motion.h2
              className="font-serif text-display text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Crafting digital
              <br />
              <span className="text-accent">experiences</span>
            </motion.h2>

            <motion.div
              className="space-y-6 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-sans text-body-lg text-foreground-muted leading-relaxed">
                I am a passionate Software Developer who thrives on solving
                real-world problems through clean, efficient code. I specialize
                in Web Development, Backend Engineering, and building scalable,
                user-friendly applications.
              </p>
              <p className="font-sans text-body text-foreground-muted leading-relaxed">
                Constantly exploring new technologies, I aim to deliver
                impactful solutions and contribute to meaningful projects in the
                tech community. My approach combines technical expertise with
                creative thinking to build experiences that matter.
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-sans text-caption uppercase tracking-wider text-foreground-muted mb-4">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-4 py-2 border border-border text-body-sm text-foreground-muted hover:border-accent hover:text-accent transition-colors duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isTextInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="https://drive.google.com/file/d/1fOCcukl-fld13zFX_JPTrGBgCJowoDsU/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4" />
                  <span>Download CV</span>
                </motion.button>
              </a>
              <a href="#Portofolio">
                <motion.button
                  className="font-sans text-body-sm text-foreground-muted hover:text-accent transition-colors duration-300 flex items-center gap-2 px-6 py-4"
                  whileHover={{ x: 4 }}
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-32 border-t border-l border-border">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutPage);
