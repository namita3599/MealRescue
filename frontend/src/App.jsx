import {React, useContext} from 'react';
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

function App() {

  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/claimed-posts" element={<ClaimedPostsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

