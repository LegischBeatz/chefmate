
import React from 'react';
import { Navbar } from '../components/Navbar';
import { PricingSection } from '../components/PricingSection';
import { Button } from '../components/ui/Button';
import { ViewState } from '../types';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';

interface PricingProps {
  onNavigate: (view: ViewState) => void;
}

const FAQS = [
  {
    q: "What counts as a 'generation'?",
    a: "Every time you click 'Generate' in the Inspire tool or create a new plan in the Weekly Planner, it counts as one generation. Editing or viewing saved recipes does not count toward your limit."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, absolutely. You can cancel your subscription at any time directly from the Settings page. You will retain access to Pro features until the end of your current billing period."
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 14-day money-back guarantee for Planner Pro subscriptions. If you're not satisfied with the service, reach out to our support team and we'll process your refund, no questions asked."
  }
];

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-zinc-50/50 relative">
      <Navbar currentView="pricing" onNavigate={onNavigate} />
      
      <main className="relative z-10 pt-20 pb-24">
        
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-4 md:mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-chef-black tracking-tight mb-6 text-balance">
                Simple, transparent <span className="text-chef-green">pricing.</span>
            </h1>
            <p className="text-xl text-chef-dark max-w-2xl mx-auto leading-relaxed">
                No credit card required for the free tier. Cancel anytime.
            </p>
        </div>

        {/* Pricing Grid - Header hidden to avoid duplication */}
        <div className="mb-20">
            <PricingSection onNavigate={onNavigate} showHeader={false} />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 mb-24">
            <div className="flex items-center justify-center mb-10 space-x-3">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-chef-green border border-zinc-100">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-bold text-chef-black tracking-tight">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
                {FAQS.map((faq, index) => (
                    <details 
                        key={index}
                        className="group bg-white/60 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md open:ring-1 open:ring-chef-green/20 open:bg-white/80"
                    >
                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-lg font-bold text-zinc-900 select-none">
                            {faq.q}
                            <ChevronDown className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform duration-300 group-open:text-chef-green" />
                        </summary>
                        <div className="px-6 pb-6 text-zinc-600 leading-relaxed text-base border-t border-transparent group-open:border-zinc-100 animate-in slide-in-from-top-2">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-2xl mx-auto px-4 text-center">
             <h3 className="text-2xl font-bold text-chef-black mb-6">Still not sure?</h3>
             <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onNavigate('landing')}
                className="bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900 shadow-sm"
             >
                Start with the Free Tier <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
        </div>

      </main>
    </div>
  );
};
