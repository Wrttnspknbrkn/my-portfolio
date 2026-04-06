import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
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
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent group-hover:text-accent transition-colors" />
        <span className="text-xs md:text-sm font-medium text-foreground-muted group-hover:text-foreground transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 hover:bg-accent/5 transition-all duration-300 border border-transparent hover:border-border">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-accent/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-foreground-muted group-hover:text-foreground transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-background-secondary border border-border overflow-hidden relative">
      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-accent/5 p-2 md:p-3 border border-accent/20 transition-all duration-300 hover:scale-105 hover:border-accent/50">
        <div className="bg-accent/20 p-1.5 md:p-2 rounded-full">
          <Code2 className="text-accent w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-accent">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-foreground-muted">Tech Stack</div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-accent/5 p-2 md:p-3 border border-accent/20 transition-all duration-300 hover:scale-105 hover:border-accent/50">
        <div className="bg-accent/20 p-1.5 md:p-2 rounded-full">
          <Layers className="text-accent w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-accent">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-foreground-muted">Key Features</div>
        </div>
      </div>
    </div>
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const selectedProject = storedProjects.find((p) => String(p.id) === id);
    
    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || 'https://github.com/Wrttnspknbrkn',
      };
      setProject(enhancedProject);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-foreground">Loading Project...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-accent/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-accent/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-background-secondary backdrop-blur-xl border border-border text-foreground hover:border-accent transition-all duration-300 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-foreground-muted">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-foreground truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-serif text-foreground leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-accent rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-accent rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-foreground-muted leading-relaxed">
                  {project.Description}
                </p>
              </div>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 overflow-hidden text-sm md:text-base"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-accent/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Live Demo</span>
                </a>

                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-300 overflow-hidden text-sm md:text-base"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-accent/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Github</span>
                </a>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-foreground-muted opacity-50">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="relative overflow-hidden border border-border shadow-2xl group">
              
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                  onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/20 transition-colors duration-300" />
              </div>

              {/* Key Features */}
              <div className="bg-background-secondary border border-border p-6 md:p-8 space-y-6 hover:border-accent/30 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
                  <Star className="w-5 h-5 text-accent group-hover:rotate-[20deg] transition-transform duration-300" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground-muted opacity-50">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
