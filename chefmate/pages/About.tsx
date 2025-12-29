
import React from 'react';
import { Navbar } from '../components/Navbar';
import { ViewState } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowRight, Utensils, Heart, Zap } from 'lucide-react';

interface AboutProps {
  onNavigate: (view: ViewState) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-zinc-50/50 relative">
      <Navbar currentView="about" onNavigate={onNavigate} />
      
      <main className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* HERO SECTION */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-chef-black tracking-tight mb-6 leading-tight text-balance">
              We are home cooks, <br className="hidden md:block" />
              <span className="text-chef-green">just like you.</span>
            </h1>
            <p className="text-xl text-chef-dark leading-relaxed font-medium">
              Building the tool we wished existed at 6 PM on a Tuesday, when the fridge is full but inspiration is empty.
            </p>
          </div>

          {/* THE MISSION - GLASS CARD */}
          <div className="
            bg-white/70 backdrop-blur-xl 
            border border-white/50 
            shadow-sm rounded-2xl p-8 md:p-12
            grid md:grid-cols-2 gap-12 items-center
            relative overflow-hidden
          ">
            {/* Decorative background blob for the card */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10" />

            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-zinc-200 shadow-sm mb-2">
                 <Zap className="w-3 h-3 text-amber-500 fill-current" />
                 <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">The Problem</span>
              </div>
              <h2 className="text-2xl font-bold text-chef-black">Decision fatigue tastes terrible.</h2>
              <p className="text-chef-dark leading-relaxed">
                We realized that the hardest part of cooking wasn't the chopping or the sautéing—it was the <strong>deciding</strong>. 
              </p>
              <p className="text-chef-dark leading-relaxed">
                ChefMate was born from a simple idea: What if technology could handle the logistics (what to cook, what to buy, how to use that leftover zucchini) so humans could enjoy the creativity?
              </p>
              <p className="text-chef-dark leading-relaxed">
                We aren't replacing the chef. We're giving the chef a sous-chef that works 24/7.
              </p>
            </div>

            <div className="relative group">
               {/* Image Container with Rotation */}
               <div className="relative rounded-2xl overflow-hidden shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out border-4 border-white">
                  {/* Using a placeholder service that looks nice since we don't have the actual asset file uploaded */}
                  <img 
                    src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Team cooking together" 
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white font-medium text-sm flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-red-400 fill-current" />
                    Made with love in Zurich
                  </div>
               </div>
               
               {/* Decorative elements behind image */}
               <div className="absolute -inset-4 bg-zinc-900/5 rounded-2xl -z-10 rotate-6 group-hover:rotate-2 transition-transform duration-500" />
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-zinc-200/60">
            <div className="text-center">
               <div className="text-4xl font-extrabold text-chef-green mb-1">10k+</div>
               <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Meals Planned</div>
            </div>
            <div className="text-center border-l border-r border-zinc-100 md:border-zinc-200/0">
               <div className="text-4xl font-extrabold text-chef-green mb-1">50k+</div>
               <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Minutes Saved</div>
            </div>
            <div className="text-center">
               <div className="text-4xl font-extrabold text-chef-green mb-1">100%</div>
               <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">AI Powered</div>
            </div>
          </div>

          {/* CALL TO ACTION */}
          <div className="text-center pb-12">
            <Button 
              size="lg" 
              onClick={() => onNavigate('inspire')}
              className="h-14 px-8 text-lg shadow-xl shadow-emerald-500/20 group"
            >
              <Utensils className="w-5 h-5 mr-2" />
              Back to Kitchen
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-zinc-400">
                Ready to cook something amazing?
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};
