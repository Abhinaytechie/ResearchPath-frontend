import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ToastStack } from './components/floating/ToastStack';
import { useState } from 'react';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JournalFinder from './pages/JournalFinder';
import Upload from './pages/Upload';
import Papers from './pages/Papers';
import PaperDetail from './pages/PaperDetail';
import Templates from './pages/Templates';
import CoverLetter from './pages/CoverLetter';
import Submissions from './pages/Submissions';

import Resources from './pages/Resources';
import AnalysePaper from './pages/AnalysePaper';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-700 font-medium bg-[#fcf8ff]">Loading…</div>;
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <Router>
      <AuthProvider>
    <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-32 flex flex-col">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login addToast={addToast} />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard addToast={addToast} /></ProtectedRoute>} />
              <Route path="/journals" element={<ProtectedRoute><JournalFinder addToast={addToast} /></ProtectedRoute>} />
              <Route path="/journals/saved" element={<ProtectedRoute><JournalFinder addToast={addToast} /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload addToast={addToast} /></ProtectedRoute>} />
              <Route path="/papers" element={<ProtectedRoute><Papers addToast={addToast} /></ProtectedRoute>} />
              <Route path="/papers/:id" element={<ProtectedRoute><PaperDetail addToast={addToast} /></ProtectedRoute>} />
              <Route path="/papers/:id/analyse" element={<ProtectedRoute><AnalysePaper addToast={addToast} /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Templates addToast={addToast} /></ProtectedRoute>} />
              <Route path="/cover-letter" element={<ProtectedRoute><CoverLetter addToast={addToast} /></ProtectedRoute>} />
              <Route path="/submissions" element={<ProtectedRoute><Submissions addToast={addToast} /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            </Routes>
          </main>
          <ToastStack toasts={toasts} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
