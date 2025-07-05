import {React, useContext} from 'react';
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";

// Pages 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import ClaimedPostsPage from './pages/ClaimedPostsPage';
import NotFound from './pages/NotFound';
import LandingPage from "./pages/LandingPage";

// Components
import Navbar from './components/Navbar';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const hideNavbar = location.pathname === "/" && !user;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/claimed-posts" element={<ClaimedPostsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

