import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
  Calendar, ArrowUpRight, Sparkles,
} from "lucide-react";
import Swal from 'sweetalert2';

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  "Next.js": Globe,
  TypeScript: Code,
  Firebase: Sparkles,
  default: Package,
};

const TechBadge = ({ tech, index }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden px-4 py-2.5 bg-accent/5 border border-accent/20 hover:border-accent/50 transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      <div className="relative flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent" strokeWidth={1.5} />
        <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground transition-colors">
          {tech}
        </span>
      </div>
    </motion.div>
  );
};

const FeatureItem = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.li
      ref={ref}
      className="group flex items-start gap-4 p-4 hover:bg-accent/5 transition-all duration-300 border-b border-border/50 last:border-0"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative mt-1.5 flex-shrink-0">
        <motion.div
          className="w-2 h-2 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        />
      </div>
      <span className="text-base text-foreground-muted group-hover:text-foreground transition-colors leading-relaxed">
        {feature}
      </span>
    </motion.li>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Source Code Private',
      text: 'Sorry, the source code for this project is private.',
      confirmButtonText: 'Understood',
      confirmButtonColor: '#C9A87C',
      background: '#0D0D0D',
      color: '#FAFAF9'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [nextProject, setNextProject] = useState(null);
  
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    // Try to find by id or by title (URL encoded)
    const decodedId = decodeURIComponent(id);
    const selectedProject = storedProjects.find(
      (p) => String(p.id) === id || String(p.id) === decodedId || p.Title === decodedId
    );
    
    if (selectedProject) {
      // Handle different field names from Firebase
      const enhancedProject = {
        ...selectedProject,
        Description: selectedProject.Description || selectedProject.Deskripsi || 
          "A detailed project showcasing modern web development techniques and best practices.",
        Features: selectedProject.Features || selectedProject.Fitur || [],
        TechStack: selectedProject.TechStack || selectedProject.Tech || [],
        Github: selectedProject.Github || selectedProject.github || 'https://github.com/Wrttnspknbrkn',
        Link: selectedProject.Link || selectedProject.link || selectedProject.Demo || '',
        Year: selectedProject.Year || selectedProject.Tahun || new Date().getFullYear().toString(),
      };
      setProject(enhancedProject);

      // Find next project
      const currentIndex = storedProjects.findIndex(
        (p) => String(p.id) === id || String(p.id) === decodedId || p.Title === decodedId
      );
      if (currentIndex < storedProjects.length - 1) {
        setNextProject(storedProjects[currentIndex + 1]);
      } else if (storedProjects.length > 1) {
        setNextProject(storedProjects[0]);
      }
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div
            className="w-16 h-16 mx-auto border-2 border-accent/30 border-t-accent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="font-sans text-foreground-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="font-sans text-body-sm">Back</span>
          </button>
          <div className="flex items-center gap-2 text-foreground-muted">
            <Link to="/#Portfolio" className="font-sans text-caption hover:text-accent transition-colors">
              Projects
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-sans text-caption text-foreground truncate max-w-[150px]">
              {project.Title}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Image */}
        <motion.div
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <img
            src={project.Img}
            alt={project.Title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </motion.div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
          style={{ opacity: overlayOpacity }}
        />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {/* Year badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Calendar className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
              <span className="font-mono text-xs text-accent">{project.Year}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-serif text-[clamp(2rem,6vw,4.5rem)] text-foreground leading-[1.1] mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {project.Title}
            </motion.h1>

            {/* Quick stats */}
            <motion.div
              className="flex flex-wrap items-center gap-6 text-foreground-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="flex items-center gap-2 font-sans text-body-sm">
                <Code2 className="w-4 h-4 text-accent" strokeWidth={1.5} />
                {project.TechStack?.length || 0} Technologies
              </span>
              <span className="flex items-center gap-2 font-sans text-body-sm">
                <Layers className="w-4 h-4 text-accent" strokeWidth={1.5} />
                {project.Features?.length || 0} Features
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            {/* Main content */}
            <div>
              {/* Description */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-sans text-caption uppercase tracking-[0.2em] text-accent mb-6">
                  About the Project
                </h2>
                <p className="font-sans text-body-lg text-foreground-muted leading-relaxed">
                  {project.Description}
                </p>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-wrap gap-4 mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {project.Link && (
                  <a
                    href={project.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3.5 bg-accent text-background font-sans text-body-sm hover:bg-accent-dark transition-all duration-300"
                  >
                    <span>View Live Site</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
                  </a>
                )}
                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 border border-border text-foreground font-sans text-body-sm hover:border-accent hover:text-accent transition-all duration-300"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <Github className="w-4 h-4" strokeWidth={1.5} />
                  <span>Source Code</span>
                </a>
              </motion.div>

              {/* Features */}
              {project.Features?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Star className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    <h2 className="font-sans text-caption uppercase tracking-[0.2em] text-accent">
                      Key Features
                    </h2>
                  </div>
                  <ul className="space-y-0 border border-border rounded-lg overflow-hidden">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} index={index} />
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
              {/* Tech Stack */}
              {project.TechStack?.length > 0 && (
                <motion.div
                  className="p-6 border border-border rounded-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Code2 className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    <h3 className="font-sans text-caption uppercase tracking-[0.2em] text-accent">
                      Tech Stack
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Next Project */}
              {nextProject && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="font-sans text-caption uppercase tracking-[0.2em] text-foreground-muted mb-4">
                    Next Project
                  </p>
                  <Link
                    to={`/project/${nextProject.id}`}
                    className="group block p-4 border border-border rounded-lg hover:border-accent/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-subheading text-foreground group-hover:text-accent transition-colors">
                          {nextProject.Title}
                        </h4>
                        <p className="font-sans text-caption text-foreground-muted mt-1">
                          View project
                        </p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-foreground-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" strokeWidth={1.5} />
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
