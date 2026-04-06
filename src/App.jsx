import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from "framer-motion";
import { PortfolioProvider } from "./context/PortfolioContext";

// Footer component
const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-foreground">Kelvin</span>
          <span className="font-serif text-lg text-accent">.</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-8">
          {["Home", "About", "Work", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item === "Work" ? "Portofolio" : item}`}
              className="font-sans text-body-sm text-foreground-muted hover:text-accent transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="font-sans text-caption text-foreground-muted">
          {new Date().getFullYear()} Kelvin Fameyeh
        </p>
      </div>
    </div>
  </footer>
);

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>
      {!showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Navbar />
          <AnimatedBackground />
          <main>
            <Home />
            <About />
            <Portofolio />
            <ContactPage />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <ProjectDetails />
    <Footer />
  </motion.div>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <PortfolioProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
              />
            }
          />
          <Route path="/project/:id" element={<ProjectPageLayout />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
}

export default App;
