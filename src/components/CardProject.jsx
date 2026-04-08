import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Image container - enlarged height with full image visible */}
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden bg-background-secondary flex items-center justify-center">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        {/* Image - object-contain shows full image within controlled height */}
        <motion.img
          src={Img}
          alt={Title}
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          animate={{
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            {ProjectLink && (
              <motion.a
                href={ProjectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="flex items-center gap-2 px-5 py-3 border border-accent text-accent hover:bg-accent hover:text-background transition-colors duration-300"
                initial={{ y: 20, opacity: 0 }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-sans text-body-sm">Live Demo</span>
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </motion.a>
            )}
            {id && (
              <Link to={`/project/${id}`} onClick={handleDetails}>
                <motion.div
                  className="flex items-center gap-2 px-5 py-3 bg-accent text-background hover:bg-accent-dark transition-colors duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-sans text-body-sm">Details</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="pt-6 pb-2">
        <motion.h3
          className="font-serif text-subheading text-foreground mb-2 group-hover:text-accent transition-colors duration-300"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {Title}
        </motion.h3>
        <p className="font-sans text-body-sm text-foreground-muted line-clamp-2 leading-relaxed">
          {Description}
        </p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="h-px bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
};

export default CardProject;
