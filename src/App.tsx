import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/hizmetler" element={<Services />} />
          <Route path="/aktiviteler" element={<Activities />} />
          <Route path="/iletisim" element={<Contact />} />
          
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Admin />} />
          </Route>
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && (
        <footer className="bg-gray-800 text-white text-center py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
            <p className="mb-4">&copy; 2025 Mutlu Çocuklar Anaokulu. Tüm hakları saklıdır.</p>
            <Link 
              to="/admin/login" 
              className="text-gray-400 text-sm hover:text-pastel-orange transition-colors duration-300 flex items-center gap-2"
            >
              Yönetici Girişi
            </Link>
          </div>
        </footer>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
