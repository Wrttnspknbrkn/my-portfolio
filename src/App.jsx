import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
import CV from "./Pages/CV";
import Footer from "./components/Footer";
import { AnimatePresence } from "framer-motion";
import { PortfolioProvider } from "./context/PortfolioContext";

// Noise overlay for premium texture
const NoiseOverlay = () => (
  <div className="noise-overlay pointer-events-none" aria-hidden="true" />
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
          transition={{ duration: 0.8 }}
          className="overflow-x-hidden"
        >
          <Navbar />
          <AnimatedBackground />
          <main className="overflow-x-hidden">
            <Home />
            <About />
            <Portofolio />
            <ContactPage />
          </main>
          <Footer />
          <NoiseOverlay />
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
    className="overflow-x-hidden"
  >
    <Navbar />
    <ProjectDetails />
    <Footer />
    <NoiseOverlay />
  </motion.div>
);

const CVPageLayout = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="overflow-x-hidden"
  >
    <CV />
    <NoiseOverlay />
  </motion.div>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Prevent horizontal scroll globally
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, []);

  return (
    <PortfolioProvider>
      <BrowserRouter>
        <div className="overflow-x-hidden w-full">
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
            <Route path="/cv" element={<CVPageLayout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PortfolioProvider>
  );
}

export default App;
