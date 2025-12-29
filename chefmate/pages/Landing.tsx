
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TrialWizard } from '../components/TrialWizard';
import { BentoGrid } from '../components/BentoGrid';
import { PricingSection } from '../components/PricingSection';
import { Button } from '../components/ui/Button';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewState } from '../types';

const SignupModal = ({ isOpen, onClose, onSignup }: { isOpen: boolean; onClose: () => void; onSignup: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-chef-surface rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-chef-dark" />
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-chef-green" />
              </div>
              <h2 className="text-2xl font-bold text-chef-black mb-2">Save this recipe</h2>
              <p className="text-chef-dark">
                Create a free account to save "Garlic Butter Steak Bites" and unlock your weekly plan.
              </p>
            </div>

            <div className="space-y-4">
              <Button fullWidth size="lg" onClick={onSignup}>Continue with Google</Button>
              <Button fullWidth variant="outline" onClick={onSignup}>Continue with Email</Button>
            </div>

            <p className="text-center text-xs text-chef-dark mt-6">
              By continuing, you agree to our Terms of Service.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Landing: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView="landing" onNavigate={onNavigate} />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Text */}
              <div className="lg:col-span-5 text-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-extrabold text-chef-black tracking-tight mb-6 leading-[1.1]">
                  Stop deciding <br/>
                  <span className="text-chef-green">what to cook.</span>
                </h1>
                <p className="text-lg text-chef-dark mb-8 leading-relaxed">
                  Instant, personalized meal ideas based on what you have and how you feel. No scrolling, no life stories.
                </p>
                
                {/* Social Proof Strip */}
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                   <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                          <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100?img=${i+10}')] bg-cover`} />
                      ))}
                   </div>
                   <div className="text-sm font-semibold text-chef-dark">
                      <span className="text-chef-black">10,000+</span> meals planned
                   </div>
                </div>
              </div>

              {/* Right Column: Interactive Wizard */}
              <div className="lg:col-span-7 w-full">
                <TrialWizard onSave={() => setIsSignupModalOpen(true)} />
              </div>

            </div>
          </div>
          
          {/* Background Decor */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-green-50/50 rounded-full blur-3xl -z-10" />
        </section>

        {/* VALUE PROPS */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mb-12 md:text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-chef-black mb-4">Engineered for your palate.</h2>
              <p className="text-chef-dark">
                ChefMate isn't just a recipe database. It's a culinary intelligence engine that understands constraints.
              </p>
           </div>
           <BentoGrid />
        </section>

        {/* PRICING SECTION */}
        <PricingSection onNavigate={onNavigate} />

        {/* CTA STRIP */}
        <section className="py-24 bg-chef-black text-white">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to automate your kitchen?</h2>
              <p className="text-gray-400 mb-10 text-lg">
                Join thousands of home cooks saving time and eating better.
              </p>
              <Button size="lg" className="px-12 h-14 text-lg" onClick={() => onNavigate('signup')}>
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
           </div>
        </section>
      </main>

      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
        onSignup={() => onNavigate('signup')}
      />
    </div>
  );
};
