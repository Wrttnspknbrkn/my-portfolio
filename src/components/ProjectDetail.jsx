import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

// Tech badge component
const TechBadge = ({ tech, index }) => (
  <motion.span
    className="px-4 py-2 border border-border text-body-sm text-foreground-muted hover:border-accent hover:text-accent transition-colors duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
  >
    {tech}
  </motion.span>
);

// Feature item component
const FeatureItem = ({ feature, index }) => (
  <motion.li
    className="flex items-start gap-3 py-3 border-b border-border last:border-b-0"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
    <span className="font-sans text-body text-foreground-muted">{feature}</span>
  </motion.li>
);

// Stats component
const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 border border-border">
        <span className="font-serif text-display-sm text-accent block mb-1">
          {techStackCount}
        </span>
        <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider">
          Technologies
        </span>
      </div>
      <div className="p-6 border border-border">
        <span className="font-serif text-display-sm text-accent block mb-1">
          {featuresCount}
        </span>
        <span className="font-sans text-caption text-foreground-muted uppercase tracking-wider">
          Key Features
        </span>
      </div>
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
      background: "#0D0D0D",
      color: "#FAFAF9",
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = storedProjects.find((p) => String(p.id) === id);

    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || "https://github.com/Wrttnspknbrkn",
      };
      setProject(enhancedProject);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-body text-foreground-muted">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero section with image */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background image */}
        <motion.div
          ref={imageRef}
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={project.Img}
            alt={project.Title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </motion.div>

        {/* Back button */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-8">
          <motion.button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border hover:border-accent text-foreground transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-sans text-body-sm">Back</span>
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              className="flex items-center gap-2 text-foreground-muted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="font-sans text-caption">Projects</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-sans text-caption text-accent truncate">
                {project.Title}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section ref={contentRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
            {/* Main content */}
            <div>
              {/* Title */}
              <motion.h1
                className="font-serif text-display text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                {project.Title}
              </motion.h1>

              {/* Accent line */}
              <motion.div
                className="w-16 h-px bg-accent mb-8"
                initial={{ scaleX: 0 }}
                animate={isContentInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ transformOrigin: "left" }}
              />

              {/* Description */}
              <motion.p
                className="font-sans text-body-lg text-foreground-muted leading-relaxed mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {project.Description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
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
                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) =>
                    !handleGithubClick(project.Github) && e.preventDefault()
                  }
                >
                  <motion.button
                    className="flex items-center gap-2 px-6 py-4 border border-border hover:border-accent text-foreground-muted hover:text-accent transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-sans text-body-sm uppercase tracking-wider">
                      Source Code
                    </span>
                  </motion.button>
                </a>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Code2 className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <h2 className="font-sans text-caption uppercase tracking-wider text-foreground-muted">
                    Technologies Used
                  </h2>
                </div>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} index={index} />
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-body-sm text-foreground-muted">
                    No technologies listed.
                  </p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-8">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ProjectStats project={project} />
              </motion.div>

              {/* Features */}
              <motion.div
                className="p-8 border border-border"
                initial={{ opacity: 0, x: 30 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <h3 className="font-sans text-caption uppercase tracking-wider text-foreground-muted">
                    Key Features
                  </h3>
                </div>
                {project.Features.length > 0 ? (
                  <ul>
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} index={index} />
                    ))}
                  </ul>
                ) : (
                  <p className="font-sans text-body-sm text-foreground-muted">
                    No features listed.
                  </p>
                )}
              </motion.div>

              {/* Decorative element */}
              <div className="hidden lg:block relative">
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-accent/30" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
