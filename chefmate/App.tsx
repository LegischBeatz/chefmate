
import React, { useState, useEffect } from 'react';
import { UserProvider } from './hooks/useUser';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Settings } from './pages/Settings';
import { Inspire } from './pages/Inspire';
import { Planner } from './pages/Planner';
import { Saved } from './pages/Saved';
import { Pricing } from './pages/Pricing';
import { Impressum } from './pages/Impressum';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Grocery } from './pages/Grocery';
import { Footer } from './components/Footer';
import { ViewState } from './types';

const AppContent: React.FC = () => {
  // Initialize state from URL params if present
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as ViewState;
      if (viewParam && ['landing', 'login', 'signup', 'settings', 'saved', 'plan', 'inspire', 'pricing', 'impressum', 'privacy', 'terms', 'about', 'contact', 'grocery'].includes(viewParam)) {
        return viewParam;
      }
    }
    return 'landing';
  });

  // Optional: Sync URL with view state (for better navigation experience)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('view') !== currentView) {
            url.searchParams.set('view', currentView);
            window.history.pushState({}, '', url);
        }
      } catch (e) {
        // Ignore history errors in restricted environments (e.g. sandboxed iframes/blobs)
        console.warn('Unable to update URL history', e);
      }
    }
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onNavigate={setCurrentView} />;
      case 'signup':
        return <Signup onNavigate={setCurrentView} />;
      case 'settings':
        return <Settings onNavigate={setCurrentView} />;
      case 'inspire':
        return <Inspire onNavigate={setCurrentView} />;
      case 'plan':
        return <Planner onNavigate={setCurrentView} />;
      case 'saved':
        return <Saved onNavigate={setCurrentView} />;
      case 'grocery':
        return <Grocery onNavigate={setCurrentView} />;
      case 'pricing':
        return <Pricing onNavigate={setCurrentView} />;
      case 'impressum':
        return <Impressum onNavigate={setCurrentView} />;
      case 'privacy':
        return <Privacy onNavigate={setCurrentView} />;
      case 'terms':
        return <Terms onNavigate={setCurrentView} />;
      case 'about':
        return <About onNavigate={setCurrentView} />;
      case 'contact':
        return <Contact onNavigate={setCurrentView} />;
      case 'landing':
      default:
        return <Landing onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {renderView()}
      </div>
      <Footer onNavigate={setCurrentView} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <div className="relative min-h-screen w-full isolate bg-zinc-50/50">
        {/* Global Texture Overlay */}
        <div className="bg-noise fixed inset-0 z-0 pointer-events-none opacity-[0.03]" />
        
        {/* Ambient Gradient Blobs */}
        <div 
          className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] -z-20 pointer-events-none mix-blend-multiply" 
          aria-hidden="true" 
        />
        <div 
          className="fixed top-1/2 -left-40 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -z-20 pointer-events-none mix-blend-multiply" 
          aria-hidden="true" 
        />

        <AppContent />
      </div>
    </UserProvider>
  );
};

export default App;
