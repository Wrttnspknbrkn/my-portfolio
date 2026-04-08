import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  Download,
  MapPin,
  Phone,
  Mail,
  Github,
  Linkedin,
  Calendar,
  Building2,
  GraduationCap,
  Code2,
  Briefcase,
  Award,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Zap,
  Star,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Timeline data
const experiences = [
  {
    title: "Software Development Lead",
    company: "GydGen",
    location: "Accra, Ghana",
    period: "2021 - Present",
    type: "current",
    color: "#10B981",
    achievements: [
      { text: "Headed the Technology and Development team", metric: "Lead" },
      { text: "Achieved 95% client satisfaction with customized web solutions", metric: "95%" },
      { text: "Enhanced e-commerce functionality, boosting user experience", metric: "UX+" },
      { text: "Implemented optimized database systems with 50% faster queries", metric: "50%" },
      { text: "Utilized Git for version control, streamlining code review", metric: "Git" },
      { text: "Collaborated with cross-functional teams for quality products", metric: "Team" },
    ],
  },
  {
    title: "Network & Systems Engineer",
    company: "Volta Aluminium Company Ltd",
    location: "Tema, Ghana",
    period: "2023 - 2024",
    type: "service",
    color: "#C9A87C",
    achievements: [
      { text: "Achieved 95% system uptime through daily infrastructure checks", metric: "95%" },
      { text: "Developed Task Reporting System reducing manual errors by 30%", metric: "30%" },
      { text: "Increased resolved safety tickets by 40% with Safety Ticketing System", metric: "40%" },
      { text: "Reduced manual administrative tasks by 50% with union management app", metric: "50%" },
      { text: "Created alert system with 95% on-time contract renewal notifications", metric: "95%" },
      { text: "Implemented printing tracker system saving 25% in costs", metric: "25%" },
    ],
  },
  {
    title: "Junior Software Developer",
    company: "SpeakUpp Digital Services Ltd",
    location: "East Legon, Ghana",
    period: "2022 - 2023",
    type: "junior",
    color: "#3B82F6",
    achievements: [
      { text: "Contributed to four projects with 100% on-time delivery rate", metric: "100%" },
      { text: "Used React, GraphQL, and MongoDB for web and mobile apps", metric: "Stack" },
      { text: "Reduced debugging time by 20% through enhanced code efficiency", metric: "20%" },
      { text: "Collaborated closely with cross-functional teams", metric: "Team" },
    ],
  },
  {
    title: "Point of Sale Associate",
    company: "Gyandu Place",
    location: "East Legon, Ghana",
    period: "2022 - 2023",
    type: "early",
    color: "#8B5CF6",
    achievements: [
      { text: "Boosted customer satisfaction by 25% through relationship management", metric: "25%" },
      { text: "Improved operational efficiency by 15% using Odoo ERP system", metric: "15%" },
      { text: "Trained new team members on POS systems", metric: "Train" },
    ],
  },
];

const skills = {
  technical: [
    { name: "React.js", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 95 },
    { name: "Python", level: 75 },
    { name: "Firebase", level: 85 },
    { name: "Supabase", level: 80 },
    { name: "SQL", level: 80 },
    { name: "Git", level: 90 },
  ],
  soft: [
    "Data Analysis & Reporting",
    "Version Control",
    "Collaborative Teamwork",
    "Database Administration",
    "Web Application Development",
    "Machine Learning",
    "Strategic Planning",
    "Computer Networking",
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Akan (Twi)", level: "Native" },
    { name: "German", level: "Basic" },
  ],
};

// Animated counter
const AnimatedNumber = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value);
      const duration = 2000;
      const steps = 60;
      const increment = num / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          setCount(num);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

// Skill bar with animation
const SkillBar = ({ skill, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="group"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-body-sm text-foreground group-hover:text-accent transition-colors">
          {skill.name}
        </span>
        <span className="font-mono text-caption text-accent">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: index * 0.05 + 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
};

// Experience card with timeline
const ExperienceCard = ({ experience, index, isLast, isActive, onClick }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Timeline connector */}
      <div className="absolute left-6 top-0 bottom-0 flex flex-col items-center">
        {/* Dot */}
        <motion.div
          className="relative z-10 w-3 h-3 rounded-full border-2 border-background"
          style={{ backgroundColor: experience.color }}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: "spring" }}
        >
          {experience.type === "current" && (
            <motion.div
              className="absolute -inset-1 rounded-full"
              style={{ backgroundColor: experience.color }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
        {/* Line */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 bg-gradient-to-b from-border via-border to-transparent"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </div>

      {/* Content */}
      <div 
        className={`ml-14 pb-12 cursor-pointer group`}
        onClick={onClick}
      >
        <motion.div
          className={`p-6 border rounded-lg transition-all duration-500 ${
            isActive 
              ? "border-accent/50 bg-accent/5" 
              : "border-border hover:border-accent/30"
          }`}
          whileHover={{ x: 4 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-serif text-subheading text-foreground group-hover:text-accent transition-colors">
                {experience.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-foreground-muted">
                <span className="flex items-center gap-1.5 font-sans text-body-sm">
                  <Building2 className="w-4 h-4" strokeWidth={1.5} />
                  {experience.company}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-body-sm">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                  {experience.location}
                </span>
              </div>
            </div>
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
              style={{ backgroundColor: `${experience.color}20`, color: experience.color }}
            >
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              {experience.period}
            </div>
          </div>

          {/* Achievements - Expandable */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 gap-2 pt-4 border-t border-border/50">
                  {experience.achievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <span 
                        className="flex-shrink-0 px-2 py-0.5 text-xs font-mono rounded"
                        style={{ backgroundColor: `${experience.color}20`, color: experience.color }}
                      >
                        {achievement.metric}
                      </span>
                      <span className="font-sans text-body-sm text-foreground-muted">
                        {achievement.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand indicator */}
          <div className="flex items-center justify-center mt-3">
            <motion.div
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-foreground-muted" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CV = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [activeExperience, setActiveExperience] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax
      gsap.to(".hero-bg-pattern", {
        yPercent: 50,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Stagger reveal for hero elements
      gsap.from(".hero-element", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3,
      });

      // Section reveals
      gsap.utils.toArray(".section-reveal").forEach((section) => {
        gsap.from(section, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 bg-accent z-50"
        style={{ width: progressWidth }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="font-sans text-body-sm">Back</span>
          </Link>
          <a
            href="https://drive.google.com/file/d/1fOCcukl-fld13zFX_JPTrGBgCJowoDsU/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 rounded-lg"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-sans text-body-sm">Download PDF</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background pattern */}
        <div className="hero-bg-pattern absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(201, 168, 124, 0.4) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Intro label */}
          <motion.div
            className="hero-element inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs text-accent uppercase tracking-wider">
              Resume / Curriculum Vitae
            </span>
          </motion.div>

          {/* Name */}
          <h1 className="hero-element font-serif text-[clamp(2.5rem,8vw,5rem)] text-foreground leading-[1.1] mb-4">
            Kelvin <span className="text-accent">Fameyeh</span>
          </h1>

          {/* Title */}
          <p className="hero-element font-sans text-body-lg text-foreground-muted mb-10">
            Software Developer
          </p>

          {/* Contact links */}
          <div className="hero-element flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="tel:+4915212990668"
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground-muted hover:border-accent hover:text-accent transition-all"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">+49 152 1299 0668</span>
            </a>
            <a
              href="mailto:wycekhid10@gmail.com"
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground-muted hover:border-accent hover:text-accent transition-all"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">wycekhid10@gmail.com</span>
            </a>
          </div>

          {/* Social links */}
          <div className="hero-element flex items-center justify-center gap-4">
            <a
              href="https://github.com/Wrttnspknbrkn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border rounded-full text-foreground-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
            >
              <Github className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a
              href="https://linkedin.com/in/kelvin-fameyeh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border rounded-full text-foreground-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
            >
              <Linkedin className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-accent/50" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-background-secondary section-reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "4", label: "Years Experience", icon: Briefcase },
              { value: "15", label: "Projects Completed", icon: Target },
              { value: "95", label: "Client Satisfaction", icon: TrendingUp, suffix: "%" },
              { value: "10", label: "Technologies", icon: Code2, suffix: "+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-6 border border-border rounded-lg hover:border-accent/30 transition-colors group"
                whileHover={{ y: -4 }}
              >
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="font-serif text-display-sm text-accent block mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix || "+"} />
                </span>
                <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-20 section-reveal">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.p
            className="font-sans text-body-lg text-foreground-muted leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Experienced Software Developer with a strong background in computer science 
            and proven track record in software and web development. Proficient in 
            full-stack development, network management, and machine learning. 
            Known for delivering robust, user-focused solutions.
          </motion.p>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 section-reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-accent" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-serif text-heading text-foreground">Professional Journey</h2>
              <p className="font-sans text-body-sm text-foreground-muted mt-1">
                Click on each role to expand details
              </p>
            </div>
          </div>

          <div className="space-y-0">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={index}
                experience={exp}
                index={index}
                isLast={index === experiences.length - 1}
                isActive={activeExperience === index}
                onClick={() => setActiveExperience(activeExperience === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-background-secondary section-reveal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <Code2 className="w-6 h-6 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-heading text-foreground">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skill bars */}
            <div className="space-y-5">
              {skills.technical.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} />
              ))}
            </div>

            {/* Competencies & Languages */}
            <div className="space-y-8">
              <div>
                <h3 className="font-sans text-caption uppercase tracking-wider text-accent mb-4">
                  Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, i) => (
                    <motion.span
                      key={skill}
                      className="px-4 py-2 border border-border rounded-full font-sans text-body-sm text-foreground-muted hover:border-accent hover:text-foreground transition-all"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      whileHover={{ y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-sans text-caption uppercase tracking-wider text-accent mb-4">
                  Languages
                </h3>
                <div className="space-y-3">
                  {skills.languages.map((lang, i) => (
                    <motion.div
                      key={lang.name}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <span className="font-sans text-body-sm text-foreground">{lang.name}</span>
                      <span className="font-mono text-caption text-accent">{lang.level}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 section-reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <GraduationCap className="w-6 h-6 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-heading text-foreground">Education</h2>
          </div>

          <motion.div
            className="p-8 border border-border rounded-lg hover:border-accent/30 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h3 className="font-serif text-subheading text-foreground mb-2">
                  Bachelor of Science in Computer Science
                </h3>
                <p className="font-sans text-body text-accent mb-3">
                  Kwame Nkrumah University of Science and Technology
                </p>
                <div className="flex flex-wrap items-center gap-4 text-foreground-muted">
                  <span className="flex items-center gap-2 font-sans text-body-sm">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    Kumasi, Ghana
                  </span>
                  <span className="flex items-center gap-2 font-sans text-body-sm">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    November 2023
                  </span>
                </div>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Award className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-heading text-foreground mb-4">
              {"Let's Work Together"}
            </h2>
            <p className="font-sans text-body text-foreground-muted mb-8 max-w-xl mx-auto">
              {"I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."}
            </p>
            <Link
              to="/#Contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-background font-sans text-body hover:bg-accent-dark transition-colors rounded-lg"
            >
              <span>Get In Touch</span>
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CV;
