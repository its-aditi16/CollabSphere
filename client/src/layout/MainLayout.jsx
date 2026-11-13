import React from 'react';
import Navbar from '../components/Navbar';
import FloatingBot from '../components/FloatingBot';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-8"
      >
        {children}
      </motion.main>
      <FloatingBot />
    </div>
  );
};

export default MainLayout;
