import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { usePortfolio } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

// Tech badge with animation
const TechBadge = ({ tech, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-background-secondary border border-border rounded-lg font-sans text-body-sm text-foreground-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3, scale: 1.02 }}
    >
      <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2 opacity-60" strokeWidth={1.5} />
      {tech}
    </motion.span>
  );
};

// Feature item with animation
const FeatureItem = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.li
      ref={ref}
      className="group flex items-start gap-3 sm:gap-4 py-3 sm:py-4 border-b border-border last:border-b-0 hover:bg-accent/5 -mx-2 sm:-mx-4 px-2 sm:px-4 transition-colors duration-300"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-accent/10 text-accent font-mono text-micro sm:text-caption">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-sans text-body-sm sm:text-body text-foreground-muted group-hover:text-foreground transition-colors pt-0.5 sm:pt-1">
        {feature}
      </span>
    </motion.li>
  );
};

// Project stats card
const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: techStackCount, label: "Technologies", icon: Layers },
    { value: featuresCount, label: "Key Features", icon: Star },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="group p-4 sm:p-6 bg-background-secondary border border-border rounded-lg hover:border-accent/30 transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent mb-2 sm:mb-3 opacity-70" strokeWidth={1.5} />
          <span className="font-serif text-heading sm:text-display-sm text-accent block mb-1">
            {stat.value}
          </span>
          <span className="font-sans text-micro sm:text-caption text-foreground-muted uppercase tracking-wider">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Private Repository",
      text: "The source code for this project is private.",
      confirmButtonText: "Understood",
      confirmButtonColor: "#C9A87C",
      background: "#0A0A0A",
      color: "#FAFAF9",
      customClass: {
        popup: "border border-border rounded-lg",
      },
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading } = usePortfolio();
  const [project, setProject] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [nextProject, setNextProject] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load project data from context or localStorage
  useEffect(() => {
    const loadProject = () => {
      // First try from context (most reliable)
      let projectList = projects;
      
      // Fallback to localStorage if context is empty
      if (!projectList || projectList.length === 0) {
        const stored = localStorage.getItem("projects");
        if (stored) {
          projectList = JSON.parse(stored);
        }
      }

      if (!projectList || projectList.length === 0) return;

      // Find project by id or title (handle URL encoded titles)
      const decodedId = decodeURIComponent(id);
      const selectedProject = projectList.find(
        (p) => String(p.id) === id || 
               String(p.id) === decodedId || 
               p.Title === id || 
               p.Title === decodedId
      );

      if (selectedProject) {
        // Normalize project data - handle different field names from Firebase
        const normalizedProject = {
          ...selectedProject,
          Title: selectedProject.Title || selectedProject.title || "Untitled Project",
          Description: selectedProject.Description || selectedProject.Deskripsi || selectedProject.description || "",
          Img: selectedProject.Img || selectedProject.img || selectedProject.image || "",
          Features: selectedProject.Features || selectedProject.Fitur || selectedProject.features || [],
          TechStack: selectedProject.TechStack || selectedProject.Tech || selectedProject.techStack || [],
          Github: selectedProject.Github || selectedProject.github || selectedProject.GitHub || "https://github.com/Wrttnspknbrkn",
          Link: selectedProject.Link || selectedProject.link || selectedProject.Demo || selectedProject.demo || "",
          Year: selectedProject.Year || selectedProject.Tahun || selectedProject.year || new Date().getFullYear().toString(),
        };
        
        setProject(normalizedProject);

        // Find next project
        const currentIndex = projectList.findIndex(
          (p) => String(p.id) === id || 
                 String(p.id) === decodedId || 
                 p.Title === id || 
                 p.Title === decodedId
        );
        
        if (currentIndex !== -1 && currentIndex < projectList.length - 1) {
          setNextProject(projectList[currentIndex + 1]);
        } else if (projectList.length > 1) {
          setNextProject(projectList[0]);
        }
      }
    };

    loadProject();
  }, [id, projects]);

  // GSAP animations
  useEffect(() => {
    if (project && imageLoaded) {
      const ctx = gsap.context(() => {
        gsap.from(".project-title", {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });

        gsap.from(".project-meta", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
          stagger: 0.1,
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [project, imageLoaded]);

  // Show loading state
  if (loading && !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="font-sans text-body text-foreground-muted">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  // Show not found if no project after loading
  if (!loading && !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-display text-foreground mb-4">Project Not Found</h1>
          <p className="font-sans text-body text-foreground-muted mb-8">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link to="/" className="btn-primary inline-flex">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero section with full image */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Background image with parallax */}
        <motion.div
          ref={imageRef}
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={project.Img}
            alt={project.Title}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
        </motion.div>

        {/* Back button */}
        <motion.div
          className="absolute top-20 sm:top-24 md:top-32 left-0 right-0 z-20"
          style={{ opacity: headerOpacity }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-background/80 backdrop-blur-md border border-border hover:border-accent text-foreground transition-all duration-300 rounded-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:text-accent transition-colors" strokeWidth={1.5} />
              <span className="font-sans text-body-sm">Back to Portfolio</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">
            {/* Breadcrumb */}
            <motion.div
              className="project-meta flex items-center gap-2 text-foreground-muted mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/" className="hover:text-accent transition-colors">
                <span className="font-sans text-caption">Projects</span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-sans text-caption text-accent truncate max-w-[200px] sm:max-w-none">
                {project.Title}
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="project-title font-serif text-heading sm:text-display md:text-display-lg text-foreground max-w-4xl">
              {project.Title}
            </h1>

            {/* Meta info */}
            <div className="project-meta flex flex-wrap items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
              {project.Year && (
                <span className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-background/60 backdrop-blur-sm border border-border rounded-full">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-accent" strokeWidth={1.5} />
                  <span className="font-mono text-micro sm:text-caption text-foreground-muted">
                    {project.Year}
                  </span>
                </span>
              )}
              {project.TechStack?.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="hidden sm:inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-background/60 backdrop-blur-sm border border-border rounded-full font-mono text-micro sm:text-caption text-foreground-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section ref={contentRef} className="py-10 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16">
            {/* Main content */}
            <div>
              {/* Description */}
              <motion.div
                className="mb-10 sm:mb-16"
                initial={{ opacity: 0, y: 40 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-sans text-caption uppercase tracking-wider text-accent mb-4 sm:mb-6">
                  About the Project
                </h2>
                <p className="font-sans text-body sm:text-body-lg text-foreground leading-relaxed">
                  {project.Description || "This project showcases modern web development techniques and best practices, built with a focus on user experience and performance."}
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-16"
                initial={{ opacity: 0, y: 40 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {project.Link && (
                  <a
                    href={project.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                      <span>View Live Demo</span>
                    </motion.button>
                  </a>
                )}
                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    !handleGithubClick(project.Github) && e.preventDefault()
                  }
                >
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-4 h-4" strokeWidth={1.5} />
                    <span>Source Code</span>
                  </motion.button>
                </a>
              </motion.div>

              {/* Technologies */}
              {project.TechStack && project.TechStack.length > 0 && (
                <motion.div
                  className="mb-10 sm:mb-16"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="font-sans text-caption uppercase tracking-wider text-accent mb-4 sm:mb-6">
                    Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Features */}
              {project.Features && project.Features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="font-sans text-caption uppercase tracking-wider text-accent mb-4 sm:mb-6">
                    Key Features
                  </h2>
                  <ul className="space-y-0">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} index={index} />
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6 sm:space-y-8">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ProjectStats project={project} />
              </motion.div>

              {/* Project image thumbnail */}
              <motion.div
                className="relative overflow-hidden rounded-lg border border-border"
                initial={{ opacity: 0, x: 40 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="font-sans text-caption text-foreground">
                    {project.Title}
                  </span>
                </div>
              </motion.div>

              {/* Next project */}
              {nextProject && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="font-sans text-caption uppercase tracking-wider text-foreground-muted mb-3 sm:mb-4">
                    Next Project
                  </h3>
                  <Link
                    to={`/project/${nextProject.id}`}
                    className="group block p-3 sm:p-4 border border-border rounded-lg hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-serif text-body sm:text-subheading text-foreground group-hover:text-accent transition-colors block truncate">
                          {nextProject.Title}
                        </span>
                        <p className="font-sans text-caption text-foreground-muted mt-1 line-clamp-1">
                          {nextProject.Description || nextProject.Deskripsi}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-foreground-muted group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Decorative element */}
              <div className="hidden lg:block relative h-24">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r border-b border-accent/20 rounded-br-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
