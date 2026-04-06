import React, { useRef, useMemo, memo, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FileText, ArrowUpRight, Code2, Zap, Globe, Cpu } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const StatCard = memo(({ number, label, icon: Icon, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group relative p-8 bg-background-secondary/50 border border-border hover:border-accent/50 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <motion.div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 right-4 text-accent/10 group-hover:text-accent/20 transition-colors duration-500">
        <Icon className="w-16 h-16" strokeWidth={0.5} />
      </div>
      <div className="relative flex flex-col">
        <span className="font-serif text-display text-accent mb-2">
          <AnimatedCounter value={number} suffix="+" />
        </span>
        <span className="font-sans text-body-sm text-foreground-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-accent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
});

const SkillTag = memo(({ skill, index, isInView }) => (
  <motion.div
    className="group relative px-5 py-3 border border-border hover:border-accent bg-background-secondary/30 hover:bg-accent/10 transition-all duration-500 cursor-default overflow-hidden"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={isInView ? { opacity: 1, scale: 1 } : {}}
    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
    whileHover={{ y: -2, scale: 1.02 }}
  >
    <span className="relative z-10 font-mono text-body-sm text-foreground-muted group-hover:text-accent transition-colors duration-300">
      {skill}
    </span>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent"
      initial={{ x: "-100%" }}
      whileHover={{ x: "100%" }}
      transition={{ duration: 0.6 }}
    />
  </motion.div>
));

const RevealImage = memo(({ src, alt }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative overflow-hidden w-full h-full">
      <motion.div
        className="absolute inset-0 bg-accent z-10"
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        style={{ transformOrigin: "right" }}
      />
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.3 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />
    </div>
  );
});

const AboutPage = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, margin: "-100px" });
  const { totalProjects, totalCertificates } = usePortfolio();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stickyRef.current) {
        ScrollTrigger.create({
          trigger: stickyRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: ".sticky-content",
          pinSpacing: false,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const yearsExperience = useMemo(() => {
    const startDate = new Date("2021-09-06");
    const today = new Date();
    return (
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0)
    );
  }, []);

  const stats = useMemo(
    () => [
      { number: totalProjects, label: "Projects Completed", icon: Code2 },
      { number: yearsExperience, label: "Years Experience", icon: Zap },
      { number: totalCertificates, label: "Certifications", icon: Globe },
    ],
    [totalProjects, yearsExperience, totalCertificates]
  );

  const skills = [
    "React", "Next.js", "JavaScript", "TypeScript", "Node.js",
    "PHP", "Python", "Tailwind CSS", "Firebase", "Supabase",
    "MySQL", "MongoDB", "REST APIs", "Git",
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-section bg-background overflow-hidden"
      id="About"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/[0.02]" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-caption uppercase tracking-[0.3em] text-accent">01</span>
            <div className="w-12 h-px bg-accent" />
            <span className="font-mono text-caption uppercase tracking-[0.3em] text-foreground-muted">About Me</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          <motion.div
            className="relative lg:sticky lg:top-32"
            style={{ y: imageY, rotate: imageRotate }}
          >
            <div className="relative aspect-[4/5] pb-16">
              <RevealImage src="/profile.jpeg" alt="Kelvin Fameyeh" />

              <div className="absolute -top-4 -left-4 w-32 h-32 border-l-2 border-t-2 border-accent/40 pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-accent/40 pointer-events-none" />

              <motion.div
                className="absolute right-3 top-3 w-10 h-10 sm:w-12 sm:h-12 bg-background border border-accent/50 flex items-center justify-center z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </motion.div>

              <motion.div
                className="absolute -bottom-16 left-6 w-36 h-36 bg-background flex flex-col items-center justify-center border border-accent/30 shadow-xl z-20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <span className="font-serif text-display text-accent leading-none">
                  {yearsExperience}+
                </span>
                <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider mt-2 text-center leading-tight px-2">
                  Years of Excellence
                </span>
              </motion.div>
            </div>
          </motion.div>

          <div ref={textRef} className="lg:pt-12">
            <motion.h2
              className="font-serif text-display text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Crafting digital
              <br />
              <span className="text-gradient">experiences</span>
            </motion.h2>

            <motion.div
              className="space-y-6 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-sans text-body-lg text-foreground-muted leading-relaxed">
                I am a passionate Software Developer who thrives on solving real-world problems through clean, efficient code. I specialize in Web Development, Backend Engineering, and building scalable, user-friendly applications.
              </p>
              <p className="font-sans text-body text-foreground-muted leading-relaxed">
                Constantly exploring new technologies, I aim to deliver impactful solutions and contribute to meaningful projects in the tech community. My approach combines technical expertise with creative thinking to build experiences that matter.
              </p>
            </motion.div>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-4 h-4 text-accent" />
                <h3 className="font-mono text-caption uppercase tracking-[0.2em] text-foreground-muted">
                  Core Technologies
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} index={index} isInView={isTextInView} />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isTextInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/cv">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4" />
                  <span>View My CV</span>
                </motion.button>
              </Link>
              <a href="#Portofolio">
                <motion.button
                  className="group font-sans text-body-sm text-foreground-muted hover:text-accent transition-colors duration-300 flex items-center gap-2 px-6 py-4 border border-transparent hover:border-border"
                  whileHover={{ x: 4 }}
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>

        <div className="mt-32">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-display-sm text-foreground mb-4">
              By the <span className="text-accent">numbers</span>
            </h3>
            <p className="font-sans text-body text-foreground-muted max-w-md mx-auto">
              A snapshot of my journey and accomplishments in the tech industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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