import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import IdentifyPage from './pages/IdentifyPage';
import PlantsPage from './pages/PlantsPage';
import PlantDetailPage from './pages/PlantDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AnimatedBackground from './components/AnimatedBackground';
import { DeviceProvider } from './contexts/DeviceContext';
import './App.css';

function App() {
  return (
    <DeviceProvider>
      <Router>
        <div className="flex flex-col min-h-screen relative overflow-hidden">
          {/* Single animated background for the entire app */}
          <div className="fixed inset-0 z-0">
            <AnimatedBackground />
          </div>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/identify" element={<IdentifyPage />} />
              <Route path="/plants" element={<PlantsPage />} />
              <Route path="/plants/:id" element={<PlantDetailPage />} />
              <Route path="/plant/:id" element={<PlantDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DeviceProvider>
  );
}

export default App;