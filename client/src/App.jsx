import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useChatStore from './store/chatStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Workspace from './pages/Workspace';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import AI from './pages/AI';
import Hackathon from './pages/Hackathon';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layout/MainLayout';

function App() {
  const { checkAuth, token } = useAuthStore();
  const { connect, disconnect } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (token) {
      connect(token);
    } else {
      disconnect();
    }
  }, [token, connect, disconnect]);

  return (
    <Router>
      <div className="relative min-h-screen bg-slate-950">
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute>
              <MainLayout>
                <Projects />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <MainLayout>
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/tasks" element={
            <ProtectedRoute>
              <MainLayout>
                <Tasks />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/ai" element={
            <ProtectedRoute>
              <MainLayout>
                <AI />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/hackathon" element={
            <ProtectedRoute>
              <MainLayout>
                <Hackathon />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/workspace/:projectId" element={
            <ProtectedRoute>
              <MainLayout>
                <Workspace />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
