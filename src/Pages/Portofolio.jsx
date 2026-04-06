import React, { useState, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import { ArrowRight, Code2, Award, Layers } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

// Tab button component
const TabButton = memo(({ icon: Icon, label, isActive, onClick, index }) => (
  <motion.button
    onClick={onClick}
    className={`relative flex items-center gap-3 px-6 py-4 font-sans text-body-sm uppercase tracking-wider transition-colors duration-300 ${
      isActive
        ? "text-accent"
        : "text-foreground-muted hover:text-foreground"
    }`}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className="w-4 h-4" strokeWidth={1.5} />
    <span>{label}</span>
    {isActive && (
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-accent"
        layoutId="activeTab"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    )}
  </motion.button>
));

// See more button
const SeeMoreButton = memo(({ onClick, isShowingMore }) => (
  <motion.button
    onClick={onClick}
    className="group flex items-center gap-2 px-6 py-3 border border-border hover:border-accent text-foreground-muted hover:text-accent transition-all duration-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="font-sans text-body-sm">
      {isShowingMore ? "Show Less" : "View All"}
    </span>
    <motion.span
      animate={{ rotate: isShowingMore ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowRight className="w-4 h-4" />
    </motion.span>
  </motion.button>
));

// Tech stack data
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
  { icon: "php.svg", language: "PHP" },
  { icon: "python.svg", language: "Python" },
  { icon: "mysql.svg", language: "mySQL" },
  { icon: "jquery.svg", language: "jQuery" },
  { icon: "apache.svg", language: "Apache" },
  { icon: "git.svg", language: "Git" },
];

const tabs = [
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "stack", label: "Tech Stack", icon: Layers },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("projects");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const { projects, certificates } = usePortfolio();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

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

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-16">
          <motion.span
            className="font-sans text-caption uppercase tracking-[0.3em] text-accent block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Portfolio
          </motion.span>
          <motion.div
            className="w-12 h-px bg-accent mb-8"
            initial={{ scaleX: 0 }}
            animate={isHeaderInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />
          <motion.h2
            className="font-serif text-display text-foreground max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Selected <span className="text-accent">work</span> and expertise
          </motion.h2>
          <motion.p
            className="font-sans text-body text-foreground-muted max-w-xl mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore my journey through projects, certifications, and technical
            expertise. Each piece represents a milestone in continuous learning.
          </motion.p>
        </div>

        {/* Tabs and content layout */}
        <div className="grid lg:grid-cols-[200px_1fr] gap-12">
          {/* Tab navigation */}
          <motion.div
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-l border-border"
            initial={{ opacity: 0, x: -20 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {tabs.map((tab, index) => (
              <TabButton
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                index={index}
              />
            ))}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedCertificates.map((certificate, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {techStacks.map((stack, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.03,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <TechStackIcon
                          TechStackIcon={stack.icon}
                          Language={stack.language}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
