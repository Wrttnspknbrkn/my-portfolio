import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection } from '../firebase';
import { getDocs } from 'firebase/firestore';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to load from localStorage first for instant display
        const cachedProjects = localStorage.getItem('projects');
        const cachedCertificates = localStorage.getItem('certificates');
        
        if (cachedProjects && cachedCertificates) {
          setProjects(JSON.parse(cachedProjects));
          setCertificates(JSON.parse(cachedCertificates));
        }

        // Fetch fresh data from Firebase
        const projectCollection = collection(db, 'projects');
        const certificateCollection = collection(db, 'certificates');

        const [projectSnapshot, certificateSnapshot] = await Promise.all([
          getDocs(projectCollection),
          getDocs(certificateCollection),
        ]);

        const projectData = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          TechStack: doc.data().TechStack || [],
        }));

        const certificateData = certificateSnapshot.docs.map((doc) => doc.data());

        setProjects(projectData);
        setCertificates(certificateData);

        // Update localStorage
        localStorage.setItem('projects', JSON.stringify(projectData));
        localStorage.setItem('certificates', JSON.stringify(certificateData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    projects,
    certificates,
    loading,
    totalProjects: projects.length,
    totalCertificates: certificates.length,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
