import React, { useState, useCallback, useRef, memo, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { ArrowRight, Code2, Award, Layers, Sparkles } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Tab button component with enhanced styling
const TabButton = memo(({ icon: Icon, label, isActive, onClick, count }) => (
  <motion.button
    onClick={onClick}
    className={`relative flex items-center gap-3 px-5 py-4 font-sans text-body-sm uppercase tracking-wider transition-all duration-500 w-full lg:w-auto ${
      isActive
        ? "text-accent bg-accent/10"
        : "text-foreground-muted hover:text-foreground hover:bg-background-secondary/50"
    }`}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className="w-4 h-4" strokeWidth={1.5} />
    <span className="flex-1 text-left">{label}</span>
    {count !== undefined && (
      <span className={`font-mono text-caption px-2 py-0.5 rounded ${isActive ? 'bg-accent/20 text-accent' : 'bg-border/50 text-foreground-muted'}`}>
        {count}
      </span>
    )}
    {isActive && (
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
        layoutId="activeTab"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    )}
  </motion.button>
));

// See more button with enhanced animation
const SeeMoreButton = memo(({ onClick, isShowingMore }) => (
  <motion.button
    onClick={onClick}
    className="group flex items-center gap-3 px-8 py-4 border border-border hover:border-accent bg-transparent hover:bg-accent/5 text-foreground-muted hover:text-accent transition-all duration-500"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="font-sans text-body-sm uppercase tracking-wider">
      {isShowingMore ? "Show Less" : "View All"}
    </span>
    <motion.span
      animate={{ rotate: isShowingMore ? -90 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowRight className="w-4 h-4" />
    </motion.span>
  </motion.button>
));

// Tech stack data
const techStacks = [
  { icon: "html.svg", language: "HTML5" },
  { icon: "css.svg", language: "CSS3" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind" },
  { icon: "reactjs.svg", language: "React" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node.js" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "MUI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert" },
  { icon: "php.svg", language: "PHP" },
  { icon: "python.svg", language: "Python" },
  { icon: "mysql.svg", language: "MySQL" },
  { icon: "jquery.svg", language: "jQuery" },
  { icon: "apache.svg", language: "Apache" },
  { icon: "git.svg", language: "Git" },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("projects");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const { projects, certificates } = usePortfolio();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const techGridRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const initialItems = 6;

  // GSAP animation for tech stack
  useEffect(() => {
    if (activeTab === "stack" && techGridRef.current) {
      const items = techGridRef.current.querySelectorAll('.tech-item');
      gsap.fromTo(items, 
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5, 
          stagger: 0.03,
          ease: "power3.out"
        }
      );
    }
  }, [activeTab]);

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, initialItems);

  const tabs = [
    { id: "projects", label: "Projects", icon: Code2, count: projects.length },
    { id: "certificates", label: "Certificates", icon: Award, count: certificates.length },
    { id: "stack", label: "Tech Stack", icon: Layers, count: techStacks.length },
  ];

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-section bg-background overflow-hidden"
      id="Portofolio"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201, 168, 124, 0.5) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-caption uppercase tracking-[0.3em] text-accent">
              02
            </span>
            <div className="w-12 h-px bg-accent" />
            <span className="font-mono text-caption uppercase tracking-[0.3em] text-foreground-muted">
              Portfolio
            </span>
          </motion.div>
          
          <motion.h2
            className="font-serif text-display text-foreground max-w-2xl mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Selected <span className="text-gradient">work</span> and expertise
          </motion.h2>
          <motion.p
            className="font-sans text-body text-foreground-muted max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore my journey through projects, certifications, and technical
            expertise. Each piece represents a milestone in continuous learning.
          </motion.p>
        </div>

        {/* Tabs and content layout */}
        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          {/* Tab navigation */}
          <motion.div
            className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide lg:sticky lg:top-32 lg:self-start"
            initial={{ opacity: 0, x: -20 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0 lg:border-l border-border">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  count={tab.count}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          </motion.div>

          {/* Tab content */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <motion.div
                  key="projects"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {displayedProjects.map((project, index) => (
                      <motion.div
                        key={project.id || index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <CardProject
                          Img={project.Img}
                          Title={project.Title}
                          Description={project.Description}
                          Link={project.Link}
                          id={project.id}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {projects.length > initialItems && (
                    <div className="mt-12 flex justify-center">
                      <SeeMoreButton
                        onClick={() => toggleShowMore("projects")}
                        isShowingMore={showAllProjects}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Certificates Tab */}
              {activeTab === "certificates" && (
                <motion.div
                  key="certificates"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {displayedCertificates.map((certificate, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.08,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <Certificate ImgSertif={certificate.Img} />
                      </motion.div>
                    ))}
                  </div>
                  {certificates.length > initialItems && (
                    <div className="mt-12 flex justify-center">
                      <SeeMoreButton
                        onClick={() => toggleShowMore("certificates")}
                        isShowingMore={showAllCertificates}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tech Stack Tab */}
              {activeTab === "stack" && (
                <motion.div
                  key="stack"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Intro text */}
                  <div className="mb-8 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <p className="font-sans text-body text-foreground-muted">
                      Technologies and tools I work with on a daily basis
                    </p>
                  </div>
                  
                  {/* Tech grid */}
                  <div 
                    ref={techGridRef}
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4"
                  >
                    {techStacks.map((stack, index) => (
                      <div key={index} className="tech-item">
                        <TechStackIcon
                          TechStackIcon={stack.icon}
                          Language={stack.language}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional info */}
                  <motion.div
                    className="mt-12 p-6 border border-border bg-background-secondary/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="font-sans text-body-sm text-foreground-muted text-center">
                      Always learning and exploring new technologies. 
                      Currently diving deeper into <span className="text-accent">TypeScript</span>, 
                      <span className="text-accent"> Next.js</span>, and <span className="text-accent">Cloud Services</span>.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
