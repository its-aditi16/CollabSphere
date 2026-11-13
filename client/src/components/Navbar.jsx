import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  CheckCircle2, 
  Bot, 
  Trophy, 
  Search, 
  Plus, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useDashboardStore from '../store/dashboardStore';

const Navbar = () => {
  const location = useLocation();
  const { user, token, logout } = useAuthStore();
  const { toggleBot } = useDashboardStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/projects', icon: <FolderOpen size={18} /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquare size={18} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckCircle2 size={18} /> },
    { name: 'AI Assistant', path: '/ai', icon: <Bot size={18} /> },
    { name: 'Hackathon', path: '/hackathon', icon: <Trophy size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-[60] bg-slate-900 border-b border-slate-800 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Bot className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
            CollabSphere
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {token && navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.icon}
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {token && (
            <>
              <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-sm hover:text-white transition-colors border border-slate-700">
                <Search size={16} />
                <span className="hidden md:block">Search...</span>
                <kbd className="hidden md:block text-[10px] px-1 bg-slate-900 rounded border border-slate-700">Ctrl K</kbd>
              </button>

              <button 
                onClick={toggleBot}
                className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
                title="Ask AI"
              >
                <Bot size={20} />
              </button>
            </>
          )}

          {/* User Section or Auth Buttons */}
          <div className="flex items-center gap-3">
            {!token ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition-all"
                >
                  <span className="text-xs font-medium text-slate-300 hidden md:block">{user?.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0)}
                  </div>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-10 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-800">
                          <p className="text-sm font-bold text-white uppercase tracking-wider">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                            <User size={16} /> Profile
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                            <Settings size={16} /> Settings
                          </button>
                        </div>
                        <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                          <button 
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
