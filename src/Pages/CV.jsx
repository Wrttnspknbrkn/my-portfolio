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
  ExternalLink,
  Sparkles,
  Zap,
  Target,
  Users,
  TrendingUp,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Timeline data based on CV
const experiences = [
  {
    title: "Freelance Software Developer",
    company: "GydGen",
    location: "Accra, Ghana",
    period: "2021 - Present",
    type: "current",
    achievements: [
      { text: "Headed the Technology and Development team", metric: "Lead" },
      { text: "Achieved 95% client satisfaction with customized web solutions", metric: "95%" },
      { text: "Enhanced e-commerce functionality, boosting user experience significantly", metric: "UX+" },
      { text: "Implemented optimized database systems with 50% faster query execution", metric: "50%" },
      { text: "Utilized Git for version control, streamlining code review process", metric: "Git" },
      { text: "Collaborated with cross-functional teams to deliver high quality products", metric: "Team" },
    ],
  },
  {
    title: "Network & Systems Engineer",
    company: "Volta Aluminium Company Ltd",
    location: "Tema, Ghana",
    period: "2023 - 2024",
    type: "service",
    achievements: [
      { text: "Achieved 95% system uptime through daily infrastructure checks", metric: "95%" },
      { text: "Developed Task Reporting System reducing manual errors by 30%", metric: "30%" },
      { text: "Increased resolved safety tickets by 40% with Safety Ticketing System", metric: "40%" },
      { text: "Reduced manual administrative tasks by 50% with union management app", metric: "50%" },
      { text: "Created alert system achieving 95% on-time contract renewal notifications", metric: "95%" },
      { text: "Implemented printing tracker system saving 25% in costs", metric: "25%" },
    ],
  },
  {
    title: "Junior Software Developer",
    company: "SpeakUpp Digital Services Ltd",
    location: "East Legon, Ghana",
    period: "2022 - 2023",
    type: "junior",
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
    achievements: [
      { text: "Boosted customer satisfaction by 25% through relationship management", metric: "25%" },
      { text: "Improved operational efficiency by 15% using Odoo ERP system", metric: "15%" },
      { text: "Trained new team members on POS systems", metric: "Train" },
    ],
  },
];

const skills = {
  technical: [
    "React.js", "Node.js", "Tailwind CSS", "PHP", "Python",
    "SQL", "HTML", "CSS", "JavaScript", "Firebase", "Git",
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
  languages: ["English", "Akan (Twi)"],
};

// Animated section header
const SectionHeader = ({ icon: Icon, title, subtitle }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-4 mb-12"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
        <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
      </div>
      <div>
        <h2 className="font-serif text-heading text-foreground">{title}</h2>
        {subtitle && (
          <p className="font-sans text-body-sm text-foreground-muted mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

// Experience card with timeline
const ExperienceCard = ({ experience, index, isLast }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const typeColors = {
    current: "bg-success",
    service: "bg-accent",
    junior: "bg-blue-500",
    early: "bg-purple-500",
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative pl-8 pb-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />
      )}

      {/* Timeline dot */}
      <motion.div
        className={`absolute left-0 top-2 w-6 h-6 rounded-full ${typeColors[experience.type]} flex items-center justify-center`}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: "spring" }}
      >
        <span className="w-2 h-2 rounded-full bg-background" />
      </motion.div>

      {/* Content */}
      <div className="glass-card p-6 md:p-8 rounded-lg hover:border-accent/30 transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-subheading text-foreground mb-2">
              {experience.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-foreground-muted">
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
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
            <Calendar className="w-4 h-4 text-accent" strokeWidth={1.5} />
            <span className="font-mono text-caption text-accent">{experience.period}</span>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid sm:grid-cols-2 gap-3">
          {experience.achievements.map((achievement, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 p-3 bg-background/50 rounded-lg group hover:bg-accent/5 transition-colors duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 + i * 0.05 + 0.3 }}
            >
              <span className="flex-shrink-0 px-2 py-1 bg-accent/20 text-accent font-mono text-micro rounded">
                {achievement.metric}
              </span>
              <span className="font-sans text-body-sm text-foreground-muted group-hover:text-foreground transition-colors">
                {achievement.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Skill pill
const SkillPill = ({ skill, index, category }) => {
  const pillRef = useRef(null);
  const isInView = useInView(pillRef, { once: true });

  const categoryStyles = {
    technical: "border-accent/30 hover:border-accent hover:bg-accent/10",
    soft: "border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10",
    languages: "border-green-500/30 hover:border-green-500 hover:bg-green-500/10",
  };

  return (
    <motion.span
      ref={pillRef}
      className={`inline-flex items-center px-4 py-2 border rounded-full font-sans text-body-sm text-foreground-muted hover:text-foreground transition-all duration-300 cursor-default ${categoryStyles[category]}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
    >
      {skill}
    </motion.span>
  );
};

// Stats counter
const StatCounter = ({ value, label, icon: Icon }) => {
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
    <motion.div
      ref={ref}
      className="text-center p-6 border border-border rounded-lg hover:border-accent/30 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-6 h-6 text-accent mx-auto mb-3" strokeWidth={1.5} />
      <span className="font-serif text-display-sm text-accent block mb-1">
        {count}+
      </span>
      <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
};

const CV = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [activeSection, setActiveSection] = useState("experience");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Parallax effect
      gsap.to(".parallax-bg", {
        yPercent: 30,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-accent z-50"
        style={{ width: progressWidth }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-sans text-body-sm">Back to Portfolio</span>
          </Link>
          <a
            href="https://drive.google.com/file/d/1fOCcukl-fld13zFX_JPTrGBgCJowoDsU/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-sans text-body-sm">Download PDF</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Background */}
        <div className="parallax-bg absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at center, rgba(201, 168, 124, 0.3) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Name */}
          <h1 className="hero-text font-serif text-display-lg text-foreground mb-4">
            Kelvin <span className="text-accent">Fameyeh</span>
          </h1>

          {/* Title */}
          <p className="hero-text font-sans text-body-lg text-foreground-muted mb-8">
            Software Developer
          </p>

          {/* Contact info */}
          <div className="hero-text flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
            <a
              href="tel:+233548511391"
              className="flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">(+233) 548511391</span>
            </a>
            <a
              href="mailto:wycekhid10@gmail.com"
              className="flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">wycekhid10@gmail.com</span>
            </a>
            <a
              href="https://github.com/Wrttnspknbrkn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/kelvin-fameyeh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">LinkedIn</span>
            </a>
          </div>

          {/* Summary */}
          <motion.p
            className="hero-text font-sans text-body text-foreground-muted max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experienced Software Developer with a strong background in computer science and proven track record in software and web development. Proficient in full-stack development, network management, and machine learning. Known for delivering robust, user-focused solutions.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight className="w-6 h-6 text-accent rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCounter value="4" label="Years Experience" icon={Briefcase} />
            <StatCounter value="15" label="Projects Completed" icon={Target} />
            <StatCounter value="95" label="Client Satisfaction" icon={TrendingUp} />
            <StatCounter value="10" label="Technologies" icon={Code2} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_350px] gap-16">
            {/* Left Column - Experience */}
            <div>
              <SectionHeader
                icon={Briefcase}
                title="Professional Experience"
                subtitle="A journey through my career milestones"
              />

              <div className="space-y-0">
                {experiences.map((exp, index) => (
                  <ExperienceCard
                    key={index}
                    experience={exp}
                    index={index}
                    isLast={index === experiences.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-12 lg:sticky lg:top-24 lg:self-start">
              {/* Education */}
              <div>
                <SectionHeader icon={GraduationCap} title="Education" />
                <motion.div
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="font-serif text-subheading text-foreground mb-2">
                    Bachelor of Science
                  </h3>
                  <p className="font-sans text-body-sm text-accent mb-2">
                    Computer Science
                  </p>
                  <p className="font-sans text-body-sm text-foreground-muted mb-3">
                    Kwame Nkrumah University of Science and Technology
                  </p>
                  <div className="flex items-center gap-2 text-foreground-muted">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-sans text-caption">Kumasi, Ghana</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-muted mt-1">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-sans text-caption">November 2023</span>
                  </div>
                </motion.div>
              </div>

              {/* Technical Skills */}
              <div>
                <SectionHeader icon={Code2} title="Technical Skills" />
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, index) => (
                    <SkillPill key={skill} skill={skill} index={index} category="technical" />
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <SectionHeader icon={Users} title="Competencies" />
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill, index) => (
                    <SkillPill key={skill} skill={skill} index={index} category="soft" />
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <SectionHeader icon={Sparkles} title="Languages" />
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((lang, index) => (
                    <SkillPill key={lang} skill={lang} index={index} category="languages" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background-secondary border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-display-sm text-foreground mb-6">
              {"Let's Work"} <span className="text-accent">Together</span>
            </h2>
            <p className="font-sans text-body text-foreground-muted mb-8 max-w-xl mx-auto">
              {"I'm"} always interested in new opportunities and exciting projects.
              Feel free to reach out if you think we could create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:wycekhid10@gmail.com">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  <span>Get in Touch</span>
                </motion.button>
              </a>
              <Link to="/#Contact">
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View Portfolio</span>
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CV;
